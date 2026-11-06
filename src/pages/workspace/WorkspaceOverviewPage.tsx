import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Scale, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert, 
  Plus, 
  Sparkles, 
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  FileText
} from 'lucide-react';
import { TaskModal } from '../../components/tasks/TaskModal';

export const WorkspaceOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    currentUser, 
    team, 
    projects, 
    activeProjectId, 
    tasks, 
    activity, 
    members, 
    getFairnessAnalysis,
    changeTaskStatus 
  } = useAppStore();

  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeTasks = tasks.filter(t => t.project_id === activeProjectId);
  const myTasks = activeTasks.filter(t => t.assignee_id === currentUser.id && t.status !== 'done');
  const myDoneTasks = activeTasks.filter(t => t.assignee_id === currentUser.id && t.status === 'done');
  const analysis = getFairnessAnalysis();

  const blockedTasks = activeTasks.filter(t => t.status !== 'done' && t.is_blocked);
  const upcomingDeadlines = [...activeTasks]
    .filter(t => t.status !== 'done' && t.due_date)
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())
    .slice(0, 4);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-wider text-mutedText">
                Active Workspace • {team.name}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-warmWhite">
              Welcome back, {currentUser.full_name.split(' ')[0]} 👋
            </h1>
            <p className="text-xs sm:text-sm text-mutedText mt-1 max-w-xl leading-relaxed">
              Here is your project health snapshot for <strong className="text-warmWhite font-medium">{activeProject?.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsNewTaskOpen(true)}
              className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Task
            </button>
            <button
              onClick={() => navigate(`/app/projects/${activeProject?.id}/fairness`)}
              className="px-4 py-2 bg-midnight hover:bg-elevated text-warmWhite text-xs font-medium rounded-xl border border-elevated-border transition-all flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-lime" /> View Engine
            </button>
          </div>
        </div>
      </div>

      {/* "Team balance, right now." Snapshot */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-7 border border-elevated-border space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-elevated-border">
          <div>
            <div className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-lime" />
              <h2 className="text-lg font-bold font-display text-warmWhite">
                Team balance, right now.
              </h2>
            </div>
            <p className="text-xs text-mutedText mt-0.5">
              Live algorithmic synthesis of assigned effort, available capacity, and active bottlenecks.
            </p>
          </div>

          <button
            onClick={() => navigate(`/app/projects/${activeProject?.id}/fairness`)}
            className="text-xs text-lime hover:underline flex items-center gap-1 font-semibold self-start"
          >
            Explore Fairness Engine <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-midnight p-4 rounded-2xl border border-elevated-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
              Workload Balance Score
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-warmWhite">
                {analysis.balance_score}
              </span>
              <span className="text-xs font-mono text-mutedText">/ 100</span>
            </div>
            <span className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider mt-2 ${
              analysis.balance_score >= 80 ? 'bg-lime/20 text-lime' : 'bg-coral/20 text-coral'
            }`}>
              {analysis.balance_status}
            </span>
          </div>

          <div className="bg-midnight p-4 rounded-2xl border border-elevated-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
              Team Capacity
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-softBlue">
                {analysis.remaining_effort}
              </span>
              <span className="text-xs font-mono text-mutedText">/ {members.reduce((acc, m) => acc + m.capacity_points, 0)} pts active</span>
            </div>
            <div className="w-full bg-elevated h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className="bg-softBlue h-full rounded-full" 
                style={{ width: `${Math.min(100, (analysis.remaining_effort / (members.reduce((acc, m) => acc + m.capacity_points, 0) || 1)) * 100)}%` }} 
              />
            </div>
          </div>

          <div className="bg-midnight p-4 rounded-2xl border border-elevated-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
              Deliverables Completed
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-lime">
                {analysis.completed_effort}
              </span>
              <span className="text-xs font-mono text-mutedText">pts ({analysis.completion_rate}%)</span>
            </div>
            <span className="text-[10px] text-mutedText mt-2 block">
              {activeTasks.filter(t => t.status === 'done').length} verified tasks
            </span>
          </div>

          <div className="bg-midnight p-4 rounded-2xl border border-elevated-border">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
              Blocked Tasks
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${blockedTasks.length > 0 ? 'text-coral' : 'text-lime'}`}>
                {blockedTasks.length}
              </span>
              <span className="text-xs font-mono text-mutedText">stalled items</span>
            </div>
            <span className={`text-[10px] mt-2 block ${blockedTasks.length > 0 ? 'text-coral' : 'text-mutedText'}`}>
              {blockedTasks.length > 0 ? 'Requires unblocking' : 'No blocker detected'}
            </span>
          </div>
        </div>

        {/* Member Load Distribution Strip */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-warmWhite block mb-3 font-display">
            Teammate Workload Distribution
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
            {analysis.member_metrics.map(m => (
              <div
                key={m.user_id}
                onClick={() => navigate(`/app/projects/${activeProject?.id}/fairness`)}
                className="p-3 bg-midnight/80 hover:bg-midnight rounded-xl border border-elevated-border transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <img src={m.avatar_url} alt={m.name} className="w-6 h-6 rounded-full object-cover border border-elevated-border" />
                  <span className="text-xs font-bold text-warmWhite truncate block group-hover:text-lime transition-colors">
                    {m.name.split(' ')[0]}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-[11px] font-mono">
                  <span className="text-mutedText">{m.assigned_effort} / {m.capacity_points}p</span>
                  <span className={`font-bold ${
                    m.load_status === 'overloaded' ? 'text-coral' : m.load_status === 'underutilized' ? 'text-softBlue' : 'text-lime'
                  }`}>
                    {m.utilization_pct}%
                  </span>
                </div>
                <div className="w-full bg-elevated h-1 rounded-full mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      m.load_status === 'overloaded' ? 'bg-coral' : m.load_status === 'underutilized' ? 'bg-softBlue' : 'bg-lime'
                    }`}
                    style={{ width: `${Math.min(100, m.utilization_pct)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout: My Tasks & Project Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: My Tasks & Blockers */}
        <div className="lg:col-span-7 space-y-6">
          {/* Active Tasks Assigned to Current User */}
          <div className="surface-elevated rounded-2xl p-6 border border-elevated-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold font-display text-warmWhite">
                  My Active Tasks ({myTasks.length})
                </h3>
              </div>
              <button
                onClick={() => navigate(`/app/projects/${activeProject?.id}/board`)}
                className="text-xs text-lime hover:underline font-semibold"
              >
                Open Kanban Board →
              </button>
            </div>

            <div className="space-y-2.5">
              {myTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3.5 bg-midnight rounded-xl border border-elevated-border hover:border-lime/30 transition-all flex items-center justify-between gap-3 text-xs"
                >
                  <div className="truncate flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-elevated text-warmWhite">
                        {task.status.replace('_', ' ')}
                      </span>
                      <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold text-lime rounded bg-elevated">
                        {task.estimated_effort} pts
                      </span>
                      {task.is_blocked && (
                        <span className="px-1.5 py-0.5 text-[9px] font-bold text-coral rounded bg-coral/15">
                          Blocked
                        </span>
                      )}
                    </div>
                    <span className="text-warmWhite font-semibold block truncate">
                      {task.title}
                    </span>
                  </div>

                  <button
                    onClick={() => changeTaskStatus(task.id, 'done')}
                    className="px-3 py-1.5 bg-elevated hover:bg-lime hover:text-obsidian text-mutedText rounded-lg transition-colors font-medium text-[11px] shrink-0"
                  >
                    Mark Done
                  </button>
                </div>
              ))}

              {myTasks.length === 0 && (
                <div className="p-8 text-center bg-midnight/50 rounded-xl border border-elevated-border">
                  <CheckCircle className="w-8 h-8 text-lime mx-auto mb-2 opacity-70" />
                  <span className="text-xs text-warmWhite font-semibold block">All assigned work is complete!</span>
                  <span className="text-[11px] text-mutedText block mt-0.5">Check the task board to pull from backlog.</span>
                </div>
              )}
            </div>
          </div>

          {/* Active Blockers Alert */}
          {blockedTasks.length > 0 && (
            <div className="p-5 rounded-2xl bg-coral/10 border border-coral/30 space-y-3">
              <div className="flex items-center gap-2 text-coral">
                <ShieldAlert className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-bold font-display">
                  {blockedTasks.length} Task{blockedTasks.length > 1 ? 's' : ''} Stalled on Active Blockers
                </h4>
              </div>
              <p className="text-xs text-mutedText leading-relaxed">
                Upstream blockers risk stalling the final capstone deliverable. Address these dependencies immediately.
              </p>
              <div className="space-y-2">
                {blockedTasks.map(b => (
                  <div key={b.id} className="p-2.5 bg-midnight rounded-xl border border-elevated-border flex items-center justify-between text-xs">
                    <span className="text-warmWhite font-medium truncate">{b.title}</span>
                    <span className="text-coral text-[11px] font-medium shrink-0 ml-2">
                      {b.blocker_reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Upcoming Deadlines & Recent Chronological Activity */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upcoming Deadlines */}
          <div className="surface-elevated rounded-2xl p-6 border border-elevated-border">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-4 h-4 text-lime" />
              <h3 className="text-base font-bold font-display text-warmWhite">
                Upcoming Milestones
              </h3>
            </div>

            <div className="space-y-2.5">
              {upcomingDeadlines.map(task => {
                const assignee = members.find(m => m.user_id === task.assignee_id);
                return (
                  <div key={task.id} className="p-3 bg-midnight rounded-xl border border-elevated-border text-xs flex items-center justify-between gap-2">
                    <div className="truncate">
                      <span className="text-warmWhite font-medium block truncate">{task.title}</span>
                      <span className="text-[10px] text-mutedText block mt-0.5">
                        Assigned to {assignee?.name.split(' ')[0]} • {task.estimated_effort} pts
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-elevated border border-elevated-border font-mono text-[10px] text-lime shrink-0">
                      {task.due_date}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="surface-elevated rounded-2xl p-6 border border-elevated-border">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold font-display text-warmWhite">
                  Recent Activity
                </h3>
              </div>
              <button
                onClick={() => navigate(`/app/projects/${activeProject?.id}/timeline`)}
                className="text-xs text-mutedText hover:text-warmWhite"
              >
                Full Timeline →
              </button>
            </div>

            <div className="space-y-3">
              {activity.slice(0, 4).map(event => (
                <div key={event.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-lime shrink-0 mt-1.5" />
                  <div className="truncate">
                    <span className="text-warmWhite font-semibold">{event.user_name}</span>{' '}
                    <span className="text-mutedText">
                      {event.event_type === 'task_completed' && 'completed task'}
                      {event.event_type === 'task_created' && 'created task'}
                      {event.event_type === 'deliverable_uploaded' && 'uploaded deliverable'}
                      {event.event_type === 'rebalanced' && 'rebalanced task'}
                      {event.event_type === 'task_blocked' && 'reported blocker on'}
                      {event.event_type === 'pulse_submitted' && 'submitted pulse check-in'}
                    </span>{' '}
                    {event.task_title && (
                      <span className="text-warmWhite font-medium truncate">"{event.task_title}"</span>
                    )}
                    <span className="text-[10px] text-mutedText/70 block mt-0.5 font-mono">
                      {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {isNewTaskOpen && (
        <TaskModal
          isOpen={isNewTaskOpen}
          onClose={() => setIsNewTaskOpen(false)}
        />
      )}
    </div>
  );
};

