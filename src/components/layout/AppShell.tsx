import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Scale, 
  LayoutDashboard, 
  FolderKanban, 
  KanbanSquare, 
  Users, 
  History, 
  BarChart3, 
  Bell, 
  UserCircle, 
  Settings, 
  Plus, 
  RotateCcw, 
  Search, 
  ChevronDown, 
  Check, 
  AlertCircle,
  Menu,
  X,
  Sparkles
} from 'lucide-react';
import { TaskModal } from '../tasks/TaskModal';

export const AppShell: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const {
    currentUser,
    members,
    projects,
    activeProjectId,
    setActiveProject,
    switchUser,
    resetDemoWorkspace,
    notifications,
    getFairnessAnalysis,
  } = useAppStore();

  const [isUserSwitcherOpen, setIsUserSwitcherOpen] = useState(false);
  const [isProjectSwitcherOpen, setIsProjectSwitcherOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const fairnessAnalysis = getFairnessAnalysis();
  const unreadNotifsCount = notifications.filter(n => !n.read_at).length;

  const currentProjId = activeProject?.id || 'proj-nebula-main';

  const navItems = [
    { label: 'Overview', path: '/app', icon: LayoutDashboard, exact: true },
    { label: 'Projects', path: '/app/projects', icon: FolderKanban },
    { label: 'Task Board', path: `/app/projects/${currentProjId}/board`, icon: KanbanSquare },
    { 
      label: 'Fairness Engine', 
      path: `/app/projects/${currentProjId}/fairness`, 
      icon: Scale, 
      badge: `${fairnessAnalysis.balance_score}%`,
      badgeColor: fairnessAnalysis.balance_score < 70 ? 'bg-coral/20 text-coral border-coral/30' : 'bg-lime/20 text-lime border-lime/30'
    },
    { label: 'Team', path: `/app/projects/${currentProjId}/team`, icon: Users },
    { label: 'Timeline', path: `/app/projects/${currentProjId}/timeline`, icon: History },
    { label: 'Analytics & Reports', path: `/app/projects/${currentProjId}/insights`, icon: BarChart3 },
    { 
      label: 'Inbox', 
      path: '/app/inbox', 
      icon: Bell, 
      badge: unreadNotifsCount > 0 ? String(unreadNotifsCount) : undefined,
      badgeColor: 'bg-lime text-obsidian font-bold'
    },
  ];

  return (
    <div className="min-h-screen bg-obsidian text-warmWhite flex">
      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-obsidian/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Persistent Left Sidebar */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50 w-72 bg-midnight border-r border-elevated-border flex flex-col justify-between transition-transform duration-300
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="p-5 border-b border-elevated-border flex items-center justify-between">
            <div 
              onClick={() => navigate('/')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 rounded-xl bg-lime/15 border border-lime/30 flex items-center justify-center text-lime group-hover:scale-105 transition-transform">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-lg font-display tracking-tight text-warmWhite flex items-center gap-1.5">
                  FairShare
                  <span className="w-1.5 h-1.5 rounded-full bg-lime animate-pulse" />
                </span>
                <span className="text-[10px] text-mutedText block font-mono">
                  DEMO WORKSPACE
                </span>
              </div>
            </div>

            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-mutedText hover:text-warmWhite"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Project Selector */}
          <div className="p-4 border-b border-elevated-border">
            <div className="relative">
              <button
                onClick={() => setIsProjectSwitcherOpen(!isProjectSwitcherOpen)}
                className="w-full p-2.5 bg-elevated/70 hover:bg-elevated rounded-xl border border-elevated-border flex items-center justify-between text-left transition-all"
              >
                <div className="truncate">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-mutedText block">
                    Active Project
                  </span>
                  <span className="text-xs font-bold text-warmWhite truncate block">
                    {activeProject?.name || 'Select Project'}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-mutedText shrink-0" />
              </button>

              {isProjectSwitcherOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-elevated border border-elevated-border rounded-xl shadow-xl z-30 py-1 overflow-hidden">
                  {projects.map(p => (
                    <button
                      key={p.id}
                      onClick={() => {
                        setActiveProject(p.id);
                        setIsProjectSwitcherOpen(false);
                      }}
                      className="w-full px-3 py-2 text-xs flex items-center justify-between hover:bg-midnight text-left text-warmWhite"
                    >
                      <span className="truncate">{p.name}</span>
                      {p.id === activeProjectId && <Check className="w-3.5 h-3.5 text-lime" />}
                    </button>
                  ))}
                  <div className="border-t border-elevated-border my-1" />
                  <button
                    onClick={() => {
                      setIsProjectSwitcherOpen(false);
                      navigate('/app/projects');
                    }}
                    className="w-full px-3 py-2 text-xs text-lime font-medium hover:bg-midnight text-left flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> New Project
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = item.exact 
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all group
                    ${isActive
                      ? 'bg-elevated text-warmWhite font-semibold border border-elevated-border shadow-sm'
                      : 'text-mutedText hover:text-warmWhite hover:bg-elevated/40'
                    }
                  `}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 transition-colors ${isActive ? 'text-lime' : 'text-mutedText group-hover:text-warmWhite'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`px-2 py-0.5 text-[10px] rounded-full border ${item.badgeColor || 'bg-midnight text-mutedText border-elevated-border'}`}>
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Profile & Switcher */}
        <div className="p-4 border-t border-elevated-border space-y-3">
          {/* Quick Demo Contributor Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsUserSwitcherOpen(!isUserSwitcherOpen)}
              className="w-full p-2 bg-elevated/70 hover:bg-elevated rounded-xl border border-elevated-border flex items-center gap-2.5 text-left transition-all"
            >
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-8 h-8 rounded-full border border-lime object-cover shrink-0"
              />
              <div className="truncate flex-1">
                <span className="text-xs font-bold text-warmWhite block truncate">
                  {currentUser.full_name}
                </span>
                <span className="text-[10px] text-mutedText truncate block">
                  {currentUser.role}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-mutedText shrink-0" />
            </button>

            {isUserSwitcherOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-elevated border border-elevated-border rounded-xl shadow-2xl z-30 p-2 overflow-hidden max-h-72 overflow-y-auto">
                <span className="text-[10px] uppercase font-mono tracking-wider text-mutedText px-2 py-1 block">
                  Switch Demo Member
                </span>
                {members.map(m => (
                  <button
                    key={m.user_id}
                    onClick={() => {
                      switchUser(m.user_id);
                      setIsUserSwitcherOpen(false);
                    }}
                    className={`w-full px-2.5 py-2 rounded-lg text-xs flex items-center gap-2 hover:bg-midnight transition-colors text-left ${
                      m.user_id === currentUser.id ? 'bg-midnight/70 text-lime font-bold' : 'text-warmWhite'
                    }`}
                  >
                    <img src={m.avatar_url} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                    <div className="truncate flex-1">
                      <span className="block truncate">{m.name}</span>
                      <span className="text-[10px] text-mutedText block truncate">{m.role}</span>
                    </div>
                    {m.user_id === currentUser.id && <Check className="w-3.5 h-3.5 text-lime shrink-0" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Reset Demo / Settings Links */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => {
                if (window.confirm('Reset all demo state to original baseline?')) {
                  resetDemoWorkspace();
                }
              }}
              className="text-[11px] text-mutedText hover:text-coral flex items-center gap-1 transition-colors"
              title="Reset sample tasks, balance, and check-ins"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo
            </button>

            <NavLink
              to="/app/settings"
              className="text-[11px] text-mutedText hover:text-warmWhite flex items-center gap-1 transition-colors"
            >
              <Settings className="w-3 h-3" /> Settings
            </NavLink>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 border-b border-elevated-border bg-midnight/50 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-mutedText hover:text-warmWhite rounded-lg hover:bg-elevated"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Quick Breadcrumb */}
            <div className="hidden sm:flex items-center gap-2 text-xs">
              <span className="text-mutedText">FairShare</span>
              <span className="text-mutedText/50">/</span>
              <span className="text-mutedText truncate max-w-44">{activeProject?.name}</span>
              <span className="text-mutedText/50">/</span>
              <span className="text-warmWhite font-semibold capitalize">
                {location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action: New Task */}
            <button
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3.5 py-1.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>

            {/* Notifications Bell */}
            <button
              onClick={() => navigate('/app/inbox')}
              className="p-2 rounded-xl bg-elevated hover:bg-elevated-hover border border-elevated-border text-mutedText hover:text-warmWhite relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-coral text-obsidian text-[10px] font-bold flex items-center justify-center">
                  {unreadNotifsCount}
                </span>
              )}
            </button>

            {/* Profile Avatar */}
            <button
              onClick={() => navigate('/app/profile')}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2 rounded-xl bg-elevated hover:bg-elevated-hover border border-elevated-border transition-colors"
            >
              <img
                src={currentUser.avatar_url}
                alt={currentUser.full_name}
                className="w-6 h-6 rounded-full object-cover border border-lime"
              />
              <span className="text-xs font-medium text-warmWhite hidden md:inline">
                {currentUser.full_name.split(' ')[0]}
              </span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Global New Task Modal */}
      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  );
};

