import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Upload, ClipboardList, MessageSquare, LayoutDashboard, LogOut } from 'lucide-react';
import { clearState, getState } from '@/lib/store';

const navItems = [
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/review', label: 'Review', icon: ClipboardList },
  { path: '/practice', label: 'Practice', icon: MessageSquare },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
];

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = getState();

  const handleLogout = () => {
    clearState();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">ResumeReady</span>
          </div>

          <nav className="hidden sm:flex items-center gap-1">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`
                  px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center gap-2
                  ${location.pathname === item.path
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-surface-hover'}
                `}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              {state.user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground transition-colors"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main>{children}</main>
    </div>
  );
};

export default AppShell;
