import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  FolderKanban, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Scale, 
  Users, 
  KanbanSquare, 
  ArrowRight, 
  Paperclip, 
  AlertCircle,
  TrendingUp,
  FileText,
  Plus
} from 'lucide-react';
import { TaskModal } from '../../components/tasks/TaskModal';

export const ProjectOverviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    members, 
    getFairnessAnalysis, 
    updateProject 
  } = useAppStore();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  const project = projects.find(p => p.id === id) || projects[0];
  const projectTasks = tasks.filter(t => t.project_id === project?.id);
  const doneTasks = projectTasks.filter(t => t.status === 'done');
  const deliverables = projectTasks.flatMap(t => t.deliverables);
  const analysis = getFairnessAnalysis();

  if (!project) {
    return (
      <div className="p-8 text-center text-xs text-mutedText">
        Project not found.
      </div>
    );
  }

  const totalEffort = projectTasks.reduce((acc, t) => acc + (t.estimated_effort || 0), 0);
  const completedEffort = doneTasks.reduce((acc, t) => acc + (t.estimated_effort || 0), 0);
  const completionRate = totalEffort > 0 ? Math.round((completedEffort / totalEffort) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Project Hero Banner */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-midnight border border-elevated-border text-mutedText">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-lime/15 text-lime border border-lime/30">
                {project.status}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-warmWhite">
              {project.name}
            </h1>
            <p className="text-xs sm:text-sm text-mutedText mt-2 max-w-2xl leading-relaxed">
              {project.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-4 text-xs font-mono text-mutedText">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-lime" />
                <span>Deadline: {project.deadline}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-mutedText" />
                <span>{members.length} Collaborators</span>
              </div>
            </div>
          </div>

          {/* Quick Action Navigation Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => navigate(`/app/projects/${project.id}/board`)}
              className="px-4 py-2.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-2"
            >
              <KanbanSquare className="w-4 h-4" /> Open Kanban Board
            </button>
            <button
              onClick={() => navigate(`/app/projects/${project.id}/fairness`)}
              className="px-4 py-2.5 bg-midnight hover:bg-elevated border border-elevated-border text-warmWhite text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
            >
              <Scale className="w-4 h-4 text-lime" /> Fairness Engine
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-8 pt-6 border-t border-elevated-border">
          <div className="flex justify-between items-baseline text-xs font-mono mb-2">
            <span className="text-mutedText">Overall Project Completion</span>
            <span className="text-warmWhite font-bold">
              {completedEffort} / {totalEffort} Effort Points ({completionRate}%)
            </span>
          </div>
          <div className="w-full bg-midnight h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-lime h-full rounded-full transition-all"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Grid: Deliverables Vault & Team Workload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Deliverables Vault */}
        <div className="lg:col-span-7 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-lime" />
              <h3 className="text-base font-bold font-display text-warmWhite">
                Deliverables & Submissions Vault ({deliverables.length})
              </h3>
            </div>
          </div>

          <div className="space-y-2.5">
            {deliverables.map(del => (
              <div
                key={del.id}
                className="p-3.5 bg-midnight rounded-xl border border-elevated-border flex items-center justify-between text-xs hover:border-lime/30 transition-all"
              >
                <div className="flex items-center gap-3 truncate">
                  <div className="w-8 h-8 rounded-lg bg-elevated border border-elevated-border flex items-center justify-center text-lime shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <span className="font-bold text-warmWhite block truncate">{del.title}</span>
                    <span className="text-[10px] text-mutedText font-mono block">
                      {del.file_name} • Uploaded by {del.uploader_name}
                    </span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-elevated font-mono text-[10px] text-lime font-bold shrink-0">
                  Verified Artifact
                </span>
              </div>
            ))}

            {deliverables.length === 0 && (
              <div className="p-8 text-center bg-midnight/50 rounded-xl border border-elevated-border text-xs text-mutedText">
                No deliverables attached to completed tasks yet.
              </div>
            )}
          </div>
        </div>

        {/* Right: Quick Team Status */}
        <div className="lg:col-span-5 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-lime" />
              <h3 className="text-base font-bold font-display text-warmWhite">
                Collaborator Status
              </h3>
            </div>
            <button
              onClick={() => navigate(`/app/projects/${project.id}/team`)}
              className="text-xs text-mutedText hover:text-warmWhite"
            >
              Manage Team →
            </button>
          </div>

          <div className="space-y-3">
            {members.map(member => {
              const metric = analysis.member_metrics.find(m => m.user_id === member.user_id);
              const assigned = metric?.assigned_effort || 0;
              const isOver = metric?.load_status === 'overloaded';

              return (
                <div
                  key={member.user_id}
                  className="p-3 bg-midnight rounded-xl border border-elevated-border flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={member.avatar_url} alt={member.name} className="w-7 h-7 rounded-full object-cover border border-elevated-border" />
                    <div className="truncate">
                      <span className="font-bold text-warmWhite block truncate">{member.name}</span>
                      <span className="text-[10px] text-mutedText block truncate">{member.role}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono text-xs font-bold text-warmWhite block">
                      {assigned} / {member.capacity_points} pts
                    </span>
                    <span className={`text-[10px] uppercase font-bold ${isOver ? 'text-coral' : 'text-lime'}`}>
                      {metric?.load_status || 'optimal'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isTaskModalOpen && (
        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
        />
      )}
    </div>
  );
};

