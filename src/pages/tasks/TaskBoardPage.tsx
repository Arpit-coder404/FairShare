import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Task, TaskStatus } from '../../types';
import { TaskModal } from '../../components/tasks/TaskModal';
import { TaskDetailDrawer } from '../../components/tasks/TaskDetailDrawer';
import { 
  Plus, 
  Search, 
  Filter, 
  Clock, 
  AlertCircle, 
  Paperclip, 
  ShieldAlert, 
  CheckCircle2,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'border-mutedText/30' },
  { id: 'todo', title: 'To Do', color: 'border-softBlue/40' },
  { id: 'in_progress', title: 'In Progress', color: 'border-violet/40' },
  { id: 'in_review', title: 'In Review', color: 'border-amber-500/40' },
  { id: 'done', title: 'Done', color: 'border-lime/40' },
];

export const TaskBoardPage: React.FC = () => {
  const { 
    tasks, 
    members, 
    activeProjectId, 
    projects, 
    changeTaskStatus 
  } = useAppStore();

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [filterMember, setFilterMember] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const projectTasks = tasks.filter(t => t.project_id === activeProjectId);

  // Filter tasks
  const filteredTasks = projectTasks.filter(task => {
    if (filterMember !== 'all' && task.assignee_id !== filterMember) return false;
    if (filterPriority !== 'all' && task.priority !== filterPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        task.description.toLowerCase().includes(q) ||
        task.skills_required?.some(s => s.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId) {
      changeTaskStatus(taskId, status);
    }
  };

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Task Orchestration Board
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Track deliverable execution with effort weighting. Drag cards between workflow states.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="surface-elevated p-3 rounded-2xl border border-elevated-border flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search tasks, deliverables, skills..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-midnight border border-elevated-border text-xs text-warmWhite placeholder:text-mutedText/60 focus:border-lime"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Member Filter */}
          <div className="flex items-center gap-1.5 text-xs text-mutedText">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={filterMember}
              onChange={e => setFilterMember(e.target.value)}
              className="px-2.5 py-1.5 rounded-xl bg-midnight border border-elevated-border text-xs text-warmWhite focus:border-lime"
            >
              <option value="all">All Teammates</option>
              {members.map(m => (
                <option key={m.user_id} value={m.user_id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <select
            value={filterPriority}
            onChange={e => setFilterPriority(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-midnight border border-elevated-border text-xs text-warmWhite focus:border-lime"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {(filterMember !== 'all' || filterPriority !== 'all' || searchQuery) && (
            <button
              onClick={() => {
                setFilterMember('all');
                setFilterPriority('all');
                setSearchQuery('');
              }}
              className="px-2.5 py-1 text-xs text-coral hover:underline"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Kanban Board Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-start">
        {COLUMNS.map(column => {
          const columnTasks = filteredTasks.filter(t => t.status === column.id);
          const columnEffort = columnTasks.reduce((acc, t) => acc + (t.estimated_effort || 0), 0);

          return (
            <div
              key={column.id}
              onDragOver={handleDragOver}
              onDrop={e => handleDrop(e, column.id)}
              className="bg-midnight/70 rounded-2xl border border-elevated-border p-3 flex flex-col min-h-[550px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-elevated-border">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    column.id === 'done' ? 'bg-lime' : column.id === 'in_progress' ? 'bg-violet' : column.id === 'in_review' ? 'bg-amber-400' : 'bg-mutedText'
                  }`} />
                  <span className="text-xs font-bold font-display text-warmWhite">
                    {column.title}
                  </span>
                  <span className="px-1.5 py-0.2 rounded bg-elevated text-[10px] font-mono text-mutedText">
                    {columnTasks.length}
                  </span>
                </div>

                <span className="text-[10px] font-mono font-bold text-lime">
                  {columnEffort} pts
                </span>
              </div>

              {/* Tasks List in Column */}
              <div className="space-y-2.5 flex-1">
                {columnTasks.map(task => {
                  const assignee = members.find(m => m.user_id === task.assignee_id);

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={e => handleDragStart(e, task.id)}
                      onClick={() => setSelectedTask(task)}
                      className={`
                        p-3.5 rounded-xl bg-elevated hover:bg-elevated-hover border transition-all cursor-pointer group shadow-sm relative
                        ${task.is_blocked ? 'border-coral/40 ring-1 ring-coral/20' : 'border-elevated-border hover:border-lime/30'}
                      `}
                    >
                      {/* Priority and effort point indicators */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded ${
                          task.priority === 'urgent'
                            ? 'bg-coral/20 text-coral'
                            : task.priority === 'high'
                            ? 'bg-amber-500/20 text-amber-400'
                            : 'bg-midnight text-mutedText'
                        }`}>
                          {task.priority}
                        </span>

                        <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-midnight border border-elevated-border text-lime">
                          {task.estimated_effort} pts
                        </span>
                      </div>

                      {/* Title */}
                      <h4 className="text-xs font-bold text-warmWhite group-hover:text-lime transition-colors line-clamp-2">
                        {task.title}
                      </h4>

                      {/* Blocked indicator */}
                      {task.is_blocked && (
                        <div className="mt-2 p-1.5 rounded-lg bg-coral/15 border border-coral/30 flex items-center gap-1.5 text-[10px] text-coral font-medium">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{task.blocker_reason || 'Blocked'}</span>
                        </div>
                      )}

                      {/* Footer: Assignee & Meta */}
                      <div className="mt-3 pt-2.5 border-t border-elevated-border/60 flex items-center justify-between text-mutedText text-[11px]">
                        <div className="flex items-center gap-1.5 truncate">
                          {assignee ? (
                            <img
                              src={assignee.avatar_url}
                              alt={assignee.name}
                              className="w-5 h-5 rounded-full object-cover border border-lime shrink-0"
                              title={assignee.name}
                            />
                          ) : (
                            <span className="text-[10px]">Unassigned</span>
                          )}
                          <span className="truncate text-[10px] text-warmWhite">
                            {assignee?.name.split(' ')[0]}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          {task.deliverables.length > 0 && (
                            <span className="flex items-center gap-0.5 text-[10px] text-lime font-mono">
                              <Paperclip className="w-3 h-3" />
                              {task.deliverables.length}
                            </span>
                          )}
                          <span className="text-[10px] font-mono">
                            {task.due_date ? task.due_date.slice(5) : ''}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {columnTasks.length === 0 && (
                  <div className="h-28 rounded-xl border border-dashed border-elevated-border/80 flex items-center justify-center text-center p-3">
                    <span className="text-[11px] text-mutedText/60">
                      Drop tasks here
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Drawer & Modals */}
      {selectedTask && (
        <TaskDetailDrawer
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onEdit={task => {
            setSelectedTask(null);
            setEditingTask(task);
          }}
        />
      )}

      {(isNewTaskModalOpen || editingTask) && (
        <TaskModal
          isOpen={isNewTaskModalOpen || !!editingTask}
          initialTask={editingTask}
          onClose={() => {
            setIsNewTaskModalOpen(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

