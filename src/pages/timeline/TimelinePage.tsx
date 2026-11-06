import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { ActivityEvent } from '../../types';
import { 
  History, 
  Filter, 
  CheckCircle, 
  PlusCircle, 
  Upload, 
  RefreshCw, 
  ShieldAlert, 
  Activity, 
  Calendar,
  User,
  ArrowRight
} from 'lucide-react';

export const TimelinePage: React.FC = () => {
  const { activity, members, activeProjectId, projects } = useAppStore();
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];

  const filteredEvents = activity.filter(event => {
    if (event.project_id && event.project_id !== activeProjectId) return false;
    if (filterMember !== 'all' && event.user_id !== filterMember) return false;
    if (filterType !== 'all' && event.event_type !== filterType) return false;
    return true;
  });

  const getEventBadge = (type: ActivityEvent['event_type']) => {
    switch (type) {
      case 'task_completed':
        return { icon: CheckCircle, color: 'text-lime', bg: 'bg-lime/15 border-lime/30', label: 'Delivered' };
      case 'deliverable_uploaded':
        return { icon: Upload, color: 'text-softBlue', bg: 'bg-softBlue/15 border-softBlue/30', label: 'Artifact' };
      case 'task_created':
        return { icon: PlusCircle, color: 'text-violet', bg: 'bg-violet/15 border-violet/30', label: 'Created' };
      case 'rebalanced':
        return { icon: RefreshCw, color: 'text-amber-400', bg: 'bg-amber-400/15 border-amber-400/30', label: 'Rebalanced' };
      case 'task_blocked':
        return { icon: ShieldAlert, color: 'text-coral', bg: 'bg-coral/15 border-coral/30', label: 'Blocker' };
      default:
        return { icon: Activity, color: 'text-mutedText', bg: 'bg-midnight border-elevated-border', label: 'Event' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Contribution Timeline
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Chronological audit trail of tangible project progress, verified deliverables, and workload shifts.
          </p>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-midnight border border-elevated-border text-xs font-mono text-lime self-start">
          {filteredEvents.length} Recorded Milestone Events
        </span>
      </div>

      {/* Filter Bar */}
      <div className="surface-elevated p-3.5 rounded-2xl border border-elevated-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-mutedText" />
          <span className="text-mutedText font-semibold">Filter Timeline:</span>

          <select
            value={filterMember}
            onChange={e => setFilterMember(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
          >
            <option value="all">All Contributors</option>
            {members.map(m => (
              <option key={m.user_id} value={m.user_id}>
                {m.name}
              </option>
            ))}
          </select>

          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
          >
            <option value="all">All Action Types</option>
            <option value="task_completed">Deliverables Completed</option>
            <option value="deliverable_uploaded">Artifacts Uploaded</option>
            <option value="rebalanced">Rebalance Events</option>
            <option value="task_blocked">Blocker Alerts</option>
            <option value="task_created">Task Creation</option>
          </select>
        </div>

        {(filterMember !== 'all' || filterType !== 'all') && (
          <button
            onClick={() => { setFilterMember('all'); setFilterType('all'); }}
            className="text-coral hover:underline text-xs"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Chronological Stream */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border relative">
        {/* Continuous vertical timeline connector line */}
        <div className="absolute left-9 sm:left-12 top-10 bottom-10 w-0.5 bg-elevated-border" />

        <div className="space-y-8 relative">
          {filteredEvents.map(event => {
            const badge = getEventBadge(event.event_type);
            const Icon = badge.icon;

            return (
              <div key={event.id} className="flex items-start gap-4 sm:gap-6 group">
                {/* Node icon */}
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center border z-10 shrink-0 ${badge.bg} ${badge.color}`}>
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-midnight/90 hover:bg-midnight p-4 rounded-2xl border border-elevated-border group-hover:border-lime/30 transition-all text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-2 border-b border-elevated-border/60">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-warmWhite font-display text-sm">
                        {event.user_name}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${badge.color}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-mutedText text-[11px] font-mono">
                      <Calendar className="w-3 h-3 text-mutedText" />
                      <span>{new Date(event.created_at).toLocaleDateString()} at {new Date(event.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5">
                    {event.task_title && (
                      <p className="text-warmWhite font-medium">
                        Associated with <strong className="text-lime">"{event.task_title}"</strong>
                      </p>
                    )}

                    {event.event_type === 'rebalanced' && (
                      <p className="text-mutedText">
                        Workload redistribution executed: {event.metadata.from} → {event.metadata.to} ({event.metadata.effort} effort points transferred).
                      </p>
                    )}

                    {event.event_type === 'deliverable_uploaded' && (
                      <p className="text-mutedText">
                        Uploaded deliverable file: <span className="font-mono text-warmWhite">{event.metadata.fileName}</span> ({event.metadata.size}).
                      </p>
                    )}

                    {event.event_type === 'task_blocked' && (
                      <p className="text-coral">
                        Reason: {event.metadata.reason || 'Upstream roadblock identified.'}
                      </p>
                    )}

                    {event.event_type === 'pulse_submitted' && (
                      <p className="text-mutedText">
                        Self-reported workload: <span className="font-bold text-warmWhite uppercase">{event.metadata.workload}</span>.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {filteredEvents.length === 0 && (
            <div className="py-12 text-center text-xs text-mutedText">
              No matching activity logged for the selected filter criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

