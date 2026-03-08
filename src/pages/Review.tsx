import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getState, setState, type Skill, type Project } from '@/lib/store';
import { Check, X, ArrowRight, Code2, FolderKanban } from 'lucide-react';
import AppShell from '@/components/AppShell';

const Review = () => {
  const state = getState();
  const [skills, setSkills] = useState<Skill[]>(state.skills);
  const [projects, setProjects] = useState<Project[]>(state.projects);
  const navigate = useNavigate();

  const toggleSkill = (id: string) => {
    setSkills(prev => prev.map(s => s.id === id ? { ...s, confirmed: !s.confirmed } : s));
  };

  const toggleProject = (id: string) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, confirmed: !p.confirmed } : p));
  };

  const handleContinue = () => {
    setState({ skills, projects, currentStep: 'practice' });
    navigate('/practice');
  };

  const confirmedSkills = skills.filter(s => s.confirmed);
  const confirmedProjects = projects.filter(p => p.confirmed);

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fade-in">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Review extracted items</h1>
          <p className="text-muted-foreground">
            Confirm which skills and projects you want to practice. Deselect anything you don't want on your resume.
          </p>
        </div>

        {/* Skills */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Code2 className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Skills ({confirmedSkills.length} selected)</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {skills.map(skill => (
              <button
                key={skill.id}
                onClick={() => toggleSkill(skill.id)}
                className={`
                  flex items-center justify-between p-3 rounded-lg border transition-all text-left
                  ${skill.confirmed
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-surface opacity-60'}
                `}
              >
                <div>
                  <p className="font-medium text-sm">{skill.name}</p>
                  <p className="text-xs text-muted-foreground">{skill.category}</p>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center ${skill.confirmed ? 'bg-primary' : 'border-2 border-border'}`}>
                  {skill.confirmed && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* Projects */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-4">
            <FolderKanban className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Projects ({confirmedProjects.length} selected)</h2>
          </div>
          <div className="space-y-2">
            {projects.map(project => (
              <button
                key={project.id}
                onClick={() => toggleProject(project.id)}
                className={`
                  w-full flex items-start justify-between p-4 rounded-lg border transition-all text-left
                  ${project.confirmed
                    ? 'border-primary/30 bg-primary/5'
                    : 'border-border bg-surface opacity-60'}
                `}
              >
                <div className="flex-1">
                  <p className="font-medium text-sm">{project.name}</p>
                  <p className="text-xs text-muted-foreground mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {project.skills.map(s => (
                      <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${project.confirmed ? 'bg-primary' : 'border-2 border-border'}`}>
                  {project.confirmed && <Check className="w-3 h-3 text-primary-foreground" />}
                </div>
              </button>
            ))}
          </div>
        </section>

        <Button onClick={handleContinue} disabled={confirmedSkills.length === 0} className="w-full gap-2">
          Start practicing ({confirmedSkills.length} skills)
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </AppShell>
  );
};

export default Review;
