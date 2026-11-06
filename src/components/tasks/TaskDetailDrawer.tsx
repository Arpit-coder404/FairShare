import React, { useState } from 'react';
import { Task, TaskStatus } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Upload, 
  Trash2, 
  Edit3, 
  UserCheck, 
  ArrowRight,
  ShieldAlert,
  Paperclip,
  Check
} from 'lucide-react';

interface TaskDetailDrawerProps {
  task: Task | null;
  onClose: () => void;
  onEdit: (task: Task) => void;
}

export const TaskDetailDrawer: React.FC<TaskDetailDrawerProps> = ({ task, onClose, onEdit }) => {
  const { 
    members, 
    tasks, 
    changeTaskStatus, 
    deleteTask, 
    toggleTaskBlocked, 
    addDeliverable, 
    reassignTask,
    currentUser 
  } = useAppStore();

  const [deliverableTitle, setDeliverableTitle] = useState('');
  const [deliverableFile, setDeliverableFile] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [blockerReason, setBlockerReason] = useState(task?.blocker_reason || '');
  const [isEditingBlocker, setIsEditingBlocker] = useState(false);

  if (!task) return null;

  const assignee = members.find(m => m.user_id === task.assignee_id);
  const dependentTasks = tasks.filter(t => task.dependencies?.includes(t.id));

  const handleStatusChange = (newStatus: TaskStatus) => {
    changeTaskStatus(task.id, newStatus);
  };

  const handleDeliverableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!deliverableTitle.trim()) return;
    addDeliverable(task.id, deliverableTitle, deliverableFile || `${deliverableTitle.toLowerCase().replace(/\s+/g, '_')}.pdf`);
    setDeliverableTitle('');
    setDeliverableFile('');
    setIsUploading(false);
  };

  const handleToggleBlock = () => {
    toggleTaskBlocked(task.id, blockerReason || 'Waiting on team unblocker');
    setIsEditingBlocker(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/70 backdrop-blur-sm flex justify-end">
      <div className="w-full max-w-xl bg-elevated border-l border-elevated-border h-full flex flex-col justify-between shadow-2xl overflow-y-auto">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-elevated-border flex items-start justify-between gap-4 sticky top-0 bg-elevated/95 backdrop-blur z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`px-2.5 py-0.5 text-[10px] font-mono font-bold uppercase tracking-wider rounded ${
                  task.priority === 'urgent'
                    ? 'bg-coral/20 text-coral border border-coral/30'
                    : task.priority === 'high'
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    : 'bg-midnight text-mutedText border border-elevated-border'
                }`}>
                  {task.priority} Priority
                </span>
                <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-midnight border border-elevated-border text-lime">
                  {task.estimated_effort} Effort Points
                </span>
                {task.is_blocked && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-coral text-obsidian flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" /> Blocked
                  </span>
                )}
              </div>
              <h3 className="text-lg font-bold font-display text-warmWhite">
                {task.title}
              </h3>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => onEdit(task)}
                className="p-2 text-mutedText hover:text-warmWhite hover:bg-midnight rounded-lg transition-colors"
                title="Edit Task"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 text-mutedText hover:text-warmWhite hover:bg-midnight rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 space-y-6">
            {/* Status Selector Bar */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-mutedText block mb-2">
                Workflow Column
              </label>
              <div className="grid grid-cols-5 gap-1 bg-midnight p-1 rounded-xl border border-elevated-border">
                {(['backlog', 'todo', 'in_progress', 'in_review', 'done'] as TaskStatus[]).map(st => (
                  <button
                    key={st}
                    onClick={() => handleStatusChange(st)}
                    className={`py-1.5 text-[11px] font-medium capitalize rounded-lg transition-all ${
                      task.status === st
                        ? 'bg-elevated text-lime font-bold shadow-sm border border-elevated-border'
                        : 'text-mutedText hover:text-warmWhite'
                    }`}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Blocked State Toggle Banner */}
            <div className={`p-4 rounded-xl border ${task.is_blocked ? 'bg-coral/10 border-coral/30' : 'bg-midnight border-elevated-border'}`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className={`w-4 h-4 ${task.is_blocked ? 'text-coral' : 'text-mutedText'}`} />
                  <div>
                    <span className="text-xs font-bold text-warmWhite block">
                      {task.is_blocked ? 'Blocked: Waiting on unblocker' : 'No active blockers'}
                    </span>
                    {task.is_blocked && (
                      <span className="text-xs text-coral block mt-0.5">
                        {task.blocker_reason}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingBlocker(!isEditingBlocker)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    task.is_blocked 
                      ? 'bg-coral text-obsidian hover:bg-coral-bright' 
                      : 'bg-elevated hover:bg-elevated-hover text-mutedText hover:text-warmWhite border border-elevated-border'
                  }`}
                >
                  {task.is_blocked ? 'Resolve Blocker' : 'Mark as Blocked'}
                </button>
              </div>

              {isEditingBlocker && (
                <div className="mt-3 pt-3 border-t border-elevated-border">
                  <input
                    type="text"
                    value={blockerReason}
                    onChange={e => setBlockerReason(e.target.value)}
                    placeholder="Describe specific blocker (e.g. Waiting on API tokens from backend)..."
                    className="w-full px-3 py-2 rounded-lg bg-midnight border border-elevated-border text-xs text-warmWhite mb-2"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingBlocker(false)}
                      className="px-3 py-1 text-xs text-mutedText hover:text-warmWhite"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleToggleBlock}
                      className="px-3 py-1 text-xs bg-lime text-obsidian font-bold rounded-lg"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="text-xs font-mono uppercase tracking-wider text-mutedText block mb-1.5">
                Specification & Requirements
              </label>
              <p className="text-xs text-warmWhite leading-relaxed whitespace-pre-line bg-midnight p-3.5 rounded-xl border border-elevated-border">
                {task.description || 'No detailed description provided.'}
              </p>
            </div>

            {/* Assignee & Due Date Meta */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-midnight p-3.5 rounded-xl border border-elevated-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block mb-1.5">
                  Primary Assignee
                </span>
                {assignee ? (
                  <div className="flex items-center gap-2">
                    <img src={assignee.avatar_url} alt={assignee.name} className="w-6 h-6 rounded-full object-cover border border-lime" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-warmWhite block truncate">{assignee.name}</span>
                      <span className="text-[10px] text-mutedText block truncate">{assignee.role}</span>
                    </div>
                  </div>
                ) : (
                  <span className="text-xs text-mutedText">Unassigned</span>
                )}
              </div>

              <div className="bg-midnight p-3.5 rounded-xl border border-elevated-border">
                <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block mb-1.5">
                  Target Deadline
                </span>
                <div className="flex items-center gap-1.5 text-xs text-warmWhite font-mono mt-1">
                  <Calendar className="w-3.5 h-3.5 text-lime" />
                  <span>{task.due_date || 'No deadline set'}</span>
                </div>
              </div>
            </div>

            {/* Required Skills */}
            {task.skills_required && task.skills_required.length > 0 && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mutedText block mb-2">
                  Skills Required
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {task.skills_required.map((skill, i) => (
                    <span key={i} className="px-2.5 py-1 text-xs rounded-lg bg-midnight border border-elevated-border text-warmWhite">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Dependencies */}
            {dependentTasks.length > 0 && (
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-mutedText block mb-2">
                  Upstream Dependencies
                </label>
                <div className="space-y-1.5">
                  {dependentTasks.map(dep => (
                    <div key={dep.id} className="p-2.5 rounded-xl bg-midnight border border-elevated-border text-xs flex items-center justify-between">
                      <span className="text-warmWhite font-medium truncate">{dep.title}</span>
                      <span className={`px-2 py-0.5 text-[10px] rounded font-mono ${
                        dep.status === 'done' ? 'bg-lime/20 text-lime' : 'bg-elevated text-mutedText'
                      }`}>
                        {dep.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables Section */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-mono uppercase tracking-wider text-mutedText">
                  Attached Deliverables ({task.deliverables.length})
                </label>
                <button
                  onClick={() => setIsUploading(!isUploading)}
                  className="text-xs text-lime hover:underline flex items-center gap-1 font-medium"
                >
                  <Upload className="w-3.5 h-3.5" /> Upload Deliverable
                </button>
              </div>

              {isUploading && (
                <form onSubmit={handleDeliverableSubmit} className="mb-3 p-3 bg-midnight rounded-xl border border-elevated-border space-y-2">
                  <input
                    type="text"
                    value={deliverableTitle}
                    onChange={e => setDeliverableTitle(e.target.value)}
                    placeholder="Deliverable title (e.g. Figma Prototype Link, Test Log)"
                    className="w-full px-3 py-1.5 rounded-lg bg-elevated border border-elevated-border text-xs text-warmWhite"
                  />
                  <input
                    type="text"
                    value={deliverableFile}
                    onChange={e => setDeliverableFile(e.target.value)}
                    placeholder="File name (e.g. architecture_blueprint_v1.pdf)"
                    className="w-full px-3 py-1.5 rounded-lg bg-elevated border border-elevated-border text-xs text-warmWhite"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsUploading(false)}
                      className="px-3 py-1 text-xs text-mutedText hover:text-warmWhite"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1 text-xs bg-lime text-obsidian font-bold rounded-lg"
                    >
                      Attach
                    </button>
                  </div>
                </form>
              )}

              {task.deliverables.length === 0 ? (
                <div className="p-4 bg-midnight rounded-xl border border-elevated-border text-center">
                  <Paperclip className="w-5 h-5 text-mutedText mx-auto mb-1.5 opacity-60" />
                  <span className="text-xs text-mutedText block">No deliverables submitted yet</span>
                </div>
              ) : (
                <div className="space-y-2">
                  {task.deliverables.map(del => (
                    <div
                      key={del.id}
                      className="p-3 bg-midnight rounded-xl border border-elevated-border flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-lime shrink-0" />
                        <div className="truncate">
                          <span className="text-warmWhite font-bold block truncate">{del.title}</span>
                          <span className="text-[10px] text-mutedText block font-mono">
                            {del.file_name} • {del.uploader_name}
                          </span>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-elevated text-[10px] font-mono text-lime font-bold">
                        Verified
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-elevated-border bg-midnight/60 flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (window.confirm('Delete this task permanently?')) {
                deleteTask(task.id);
                onClose();
              }
            }}
            className="text-xs text-coral hover:underline flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Task
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-lime text-obsidian font-bold text-xs hover:bg-lime-dim transition-all shadow-glow-lime"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

