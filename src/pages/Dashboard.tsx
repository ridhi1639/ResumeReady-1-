import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getState, MOCK_SKILLS, type Skill } from '@/lib/store';
import { CheckCircle2, AlertTriangle, XCircle, HelpCircle, RotateCcw, FileText, TrendingUp, AlertCircle } from 'lucide-react';
import AppShell from '@/components/AppShell';

const readinessConfig = {
  'resume-ready': {
    label: 'Resume-Ready',
    icon: CheckCircle2,
    badgeClass: 'bg-ready-bg text-ready border-0',
    dotClass: 'bg-ready',
  },
  'needs-revision': {
    label: 'Needs Revision',
    icon: AlertTriangle,
    badgeClass: 'bg-revision-bg text-revision border-0',
    dotClass: 'bg-revision',
  },
  'not-ready': {
    label: 'Not Ready',
    icon: XCircle,
    badgeClass: 'bg-not-ready-bg text-not-ready border-0',
    dotClass: 'bg-not-ready',
  },
  'not-assessed': {
    label: 'Not Assessed',
    icon: HelpCircle,
    badgeClass: 'bg-secondary text-muted-foreground border-0',
    dotClass: 'bg-muted-foreground',
  },
};

const Dashboard = () => {
  const state = getState();
  const navigate = useNavigate();

  // Use stored skills or fall back to mock data with readiness
  const skills = state.skills.length > 0 ? state.skills : MOCK_SKILLS;

  const stats = useMemo(() => {
    const ready = skills.filter(s => s.readiness === 'resume-ready').length;
    const revision = skills.filter(s => s.readiness === 'needs-revision').length;
    const notReady = skills.filter(s => s.readiness === 'not-ready').length;
    const notAssessed = skills.filter(s => s.readiness === 'not-assessed').length;
    const total = skills.length;
    const assessed = total - notAssessed;
    const progress = total > 0 ? Math.round((assessed / total) * 100) : 0;
    return { ready, revision, notReady, notAssessed, total, assessed, progress };
  }, [skills]);

  const weakAreas = skills.filter(s => s.readiness === 'not-ready' || s.readiness === 'needs-revision');

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto py-12 px-4 animate-fade-in">
        <div className="flex items-start justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">Resume Readiness</h1>
            <p className="text-muted-foreground">
              Your preparation status at a glance. Focus on weak areas before your interview.
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/practice')} className="gap-2 flex-shrink-0">
            <RotateCcw className="w-4 h-4" />
            Practice again
          </Button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-ready" />
              <span className="text-xs text-muted-foreground">Resume-Ready</span>
            </div>
            <p className="text-2xl font-bold">{stats.ready}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-revision" />
              <span className="text-xs text-muted-foreground">Needs Revision</span>
            </div>
            <p className="text-2xl font-bold">{stats.revision}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-not-ready" />
              <span className="text-xs text-muted-foreground">Not Ready</span>
            </div>
            <p className="text-2xl font-bold">{stats.notReady}</p>
          </div>
          <div className="glass-card p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Progress</span>
            </div>
            <p className="text-2xl font-bold">{stats.progress}%</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Preparation progress</span>
            <span className="text-sm text-muted-foreground">{stats.assessed} of {stats.total} skills assessed</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden flex">
            {stats.ready > 0 && (
              <div className="h-full bg-ready transition-all" style={{ width: `${(stats.ready / stats.total) * 100}%` }} />
            )}
            {stats.revision > 0 && (
              <div className="h-full bg-revision transition-all" style={{ width: `${(stats.revision / stats.total) * 100}%` }} />
            )}
            {stats.notReady > 0 && (
              <div className="h-full bg-not-ready transition-all" style={{ width: `${(stats.notReady / stats.total) * 100}%` }} />
            )}
          </div>
        </div>

        {/* Weak areas */}
        {weakAreas.length > 0 && (
          <div className="glass-card p-5 mb-8 border-revision/20">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-revision" />
              <h3 className="font-semibold text-sm">Areas needing attention</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Consider removing these from your resume or spending more time preparing to discuss them confidently.
            </p>
            <div className="flex flex-wrap gap-2">
              {weakAreas.map(skill => {
                const config = readinessConfig[skill.readiness];
                return (
                  <Badge key={skill.id} className={config.badgeClass}>
                    {skill.name}
                  </Badge>
                );
              })}
            </div>
          </div>
        )}

        {/* Skills list */}
        <section>
          <h2 className="text-lg font-semibold mb-4">All skills</h2>
          <div className="space-y-2">
            {skills.map((skill, i) => {
              const config = readinessConfig[skill.readiness];
              const Icon = config.icon;
              const avgConfidence = skill.confidenceRatings.length > 0
                ? (skill.confidenceRatings.reduce((a, b) => a + b, 0) / skill.confidenceRatings.length).toFixed(1)
                : '—';
              return (
                <div
                  key={skill.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface hover:bg-surface-hover transition-colors"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${
                      skill.readiness === 'resume-ready' ? 'text-ready' :
                      skill.readiness === 'needs-revision' ? 'text-revision' :
                      skill.readiness === 'not-ready' ? 'text-not-ready' :
                      'text-muted-foreground'
                    }`} />
                    <div>
                      <p className="font-medium text-sm">{skill.name}</p>
                      <p className="text-xs text-muted-foreground">{skill.category} · Avg confidence: {avgConfidence}</p>
                    </div>
                  </div>
                  <Badge className={config.badgeClass}>
                    {config.label}
                  </Badge>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default Dashboard;
