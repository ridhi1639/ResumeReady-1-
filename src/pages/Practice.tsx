import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getState, setState, MOCK_QUESTIONS, MOCK_SKILLS, type Skill } from '@/lib/store';
import { ArrowRight, Lightbulb, ChevronRight, SkipForward, MessageSquare } from 'lucide-react';
import AppShell from '@/components/AppShell';

const difficultyLabel: Record<string, string> = {
  basic: 'Basic',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
};

const difficultyColor: Record<string, string> = {
  basic: 'bg-ready-bg text-ready',
  intermediate: 'bg-revision-bg text-revision',
  advanced: 'bg-not-ready-bg text-not-ready',
};

const Practice = () => {
  const state = getState();
  const confirmedSkills = state.skills.filter(s => s.confirmed);
  const [currentSkillIndex, setCurrentSkillIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [skillResults, setSkillResults] = useState<Record<string, number[]>>({});
  const navigate = useNavigate();

  const currentSkill = confirmedSkills[currentSkillIndex];
  const questions = MOCK_QUESTIONS[currentSkill?.id] || MOCK_QUESTIONS['1'] || [];
  const currentQuestion = questions[currentQuestionIndex];

  const handleRate = (rating: number) => {
    setConfidence(rating);
  };

  const handleNext = () => {
    if (confidence === null) return;

    const newResults = { ...skillResults };
    if (!newResults[currentSkill.id]) newResults[currentSkill.id] = [];
    newResults[currentSkill.id].push(confidence);
    setSkillResults(newResults);

    setConfidence(null);
    setAnswered(false);
    setShowHint(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else if (currentSkillIndex < confirmedSkills.length - 1) {
      setCurrentSkillIndex(prev => prev + 1);
      setCurrentQuestionIndex(0);
    } else {
      // Done - compute readiness
      const updatedSkills = state.skills.map(skill => {
        const ratings = newResults[skill.id];
        if (!ratings || ratings.length === 0) return skill;
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        let readiness: Skill['readiness'] = 'not-assessed';
        if (avg >= 4) readiness = 'resume-ready';
        else if (avg >= 2.5) readiness = 'needs-revision';
        else readiness = 'not-ready';
        return { ...skill, readiness, confidenceRatings: ratings, questionsAnswered: ratings.length };
      });
      setState({ skills: updatedSkills, currentStep: 'dashboard' });
      navigate('/dashboard');
    }
  };

  const handleSkipSkill = () => {
    setConfidence(null);
    setAnswered(false);
    setShowHint(false);
    setCurrentQuestionIndex(0);
    if (currentSkillIndex < confirmedSkills.length - 1) {
      setCurrentSkillIndex(prev => prev + 1);
    } else {
      const updatedSkills = state.skills.map(skill => {
        const ratings = skillResults[skill.id];
        if (!ratings || ratings.length === 0) return skill;
        const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
        let readiness: Skill['readiness'] = 'not-assessed';
        if (avg >= 4) readiness = 'resume-ready';
        else if (avg >= 2.5) readiness = 'needs-revision';
        else readiness = 'not-ready';
        return { ...skill, readiness, confidenceRatings: ratings, questionsAnswered: ratings.length };
      });
      setState({ skills: updatedSkills, currentStep: 'dashboard' });
      navigate('/dashboard');
    }
  };

  if (!currentSkill || !currentQuestion) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto py-16 px-4 text-center">
          <p className="text-muted-foreground">No questions available. Please review your skills first.</p>
          <Button onClick={() => navigate('/review')} className="mt-4">Go to Review</Button>
        </div>
      </AppShell>
    );
  }

  const totalQuestions = confirmedSkills.reduce((acc, s) => acc + (MOCK_QUESTIONS[s.id]?.length || 3), 0);
  const answeredSoFar = Object.values(skillResults).reduce((acc, r) => acc + r.length, 0);
  const progress = Math.round((answeredSoFar / totalQuestions) * 100);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">
              Skill {currentSkillIndex + 1} of {confirmedSkills.length} · Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium">{progress}%</span>
          </div>
          <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Skill badge */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium">{currentSkill.name}</Badge>
            <Badge className={`${difficultyColor[currentQuestion.difficulty]} border-0 text-xs`}>
              {difficultyLabel[currentQuestion.difficulty]}
            </Badge>
          </div>
          <button
            onClick={handleSkipSkill}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <SkipForward className="w-3 h-3" />
            Skip skill
          </button>
        </div>

        {/* Question card */}
        <div className="glass-card p-8 mb-6">
          <div className="flex items-start gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-0.5">
              <MessageSquare className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-lg font-medium leading-relaxed">{currentQuestion.question}</p>
          </div>

          {showHint && (
            <div className="bg-revision-bg border border-revision/20 rounded-lg p-4 mb-4 animate-fade-in">
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-revision mt-0.5" />
                <p className="text-sm text-revision-foreground">{currentQuestion.hint}</p>
              </div>
            </div>
          )}

          {!showHint && (
            <button
              onClick={() => setShowHint(true)}
              className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
            >
              <Lightbulb className="w-3 h-3" />
              Show hint
            </button>
          )}
        </div>

        {/* Confidence rating */}
        <div className="glass-card p-6">
          <p className="text-sm font-medium mb-1">How confident are you in your answer?</p>
          <p className="text-xs text-muted-foreground mb-4">Think about it honestly — this is for your own preparation.</p>

          <div className="flex gap-2 mb-4">
            {[1, 2, 3, 4, 5].map(rating => (
              <button
                key={rating}
                onClick={() => handleRate(rating)}
                className={`
                  flex-1 py-3 rounded-lg border text-sm font-medium transition-all
                  ${confidence === rating
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-surface hover:bg-surface-hover'}
                `}
              >
                {rating}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mb-6">
            <span>Can't explain it</span>
            <span>Could teach it</span>
          </div>

          <Button onClick={handleNext} disabled={confidence === null} className="w-full gap-2">
            Next question
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </AppShell>
  );
};

export default Practice;
