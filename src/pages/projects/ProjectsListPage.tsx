import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Project, ProjectStatus } from '../../types';
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  Clock, 
  Layers, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ArrowRight,
  TrendingUp
} from 'lucide-react';

export const ProjectsListPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    projects, 
    tasks, 
    activeProjectId, 
    setActiveProject, 
    createProject, 
    updateProject, 
    deleteProject 
  } = useAppStore();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Capstone Project');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    createProject({
      name,
      description,
      category,
      deadline,
    });

    setName('');
    setDescription('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Projects Portfolio
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Manage your collaborative coursework, hackathon submissions, and capstone initiatives.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-2 self-start"
        >
          <Plus className="w-4 h-4" /> Create Project
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map(project => {
          const projectTasks = tasks.filter(t => t.project_id === project.id);
          const doneTasks = projectTasks.filter(t => t.status === 'done');
          const totalEffort = projectTasks.reduce((acc, t) => acc + (t.estimated_effort || 0), 0);
          const completedEffort = doneTasks.reduce((acc, t) => acc + (t.estimated_effort || 0), 0);
          const progress = totalEffort > 0 ? Math.round((completedEffort / totalEffort) * 100) : 0;
          const isActive = project.id === activeProjectId;

          return (
            <div
              key={project.id}
              className={`surface-elevated rounded-3xl p-6 border transition-all relative overflow-hidden flex flex-col justify-between ${
                isActive ? 'border-lime/40 shadow-glow-lime/10 ring-1 ring-lime/20' : 'border-elevated-border hover:border-mutedText/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-midnight border border-elevated-border text-mutedText">
                    {project.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      project.status === 'active' ? 'bg-lime/15 text-lime' : 'bg-midnight text-mutedText'
                    }`}>
                      {project.status}
                    </span>
                    {isActive && (
                      <span className="px-2 py-0.5 rounded-full bg-lime text-obsidian text-[10px] font-bold">
                        Current
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-lg font-bold font-display text-warmWhite">
                  {project.name}
                </h3>
                <p className="text-xs text-mutedText mt-1.5 line-clamp-2 leading-relaxed">
                  {project.description}
                </p>

                {/* Progress bar */}
                <div className="my-5 space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-mutedText">Effort Delivered</span>
                    <span className="text-warmWhite font-bold">{completedEffort} / {totalEffort} pts ({progress}%)</span>
                  </div>
                  <div className="w-full bg-midnight h-2 rounded-full overflow-hidden">
                    <div className="bg-lime h-full rounded-full transition-all" style={{ width: `${progress}%` }} />
                  </div>
                </div>

                {/* Meta details */}
                <div className="flex items-center justify-between text-xs text-mutedText font-mono pt-3 border-t border-elevated-border">
                  <div className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-lime" />
                    <span>{projectTasks.length} tasks</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-mutedText" />
                    <span>Due {project.deadline}</span>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-5 mt-5 border-t border-elevated-border flex items-center justify-between">
                <button
                  onClick={() => {
                    if (window.confirm(`Delete project "${project.name}" and all associated tasks?`)) {
                      deleteProject(project.id);
                    }
                  }}
                  className="text-xs text-mutedText hover:text-coral flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>

                <button
                  onClick={() => {
                    setActiveProject(project.id);
                    navigate(`/app/projects/${project.id}`);
                  }}
                  className="px-4 py-2 bg-midnight hover:bg-elevated border border-elevated-border text-xs text-warmWhite hover:text-lime font-semibold rounded-xl transition-all flex items-center gap-1.5"
                >
                  <span>Open Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* New Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-elevated border border-elevated-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-display text-warmWhite mb-1">
              Create New Project
            </h3>
            <p className="text-xs text-mutedText mb-4">
              Initialize a project for team collaboration and automated fairness tracking.
            </p>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div>
                <label className="text-warmWhite font-semibold block mb-1">Project Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Distributed Database Capstone"
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Brief summary of requirements and semester objectives..."
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                >
                  <option value="Senior Capstone">Senior Capstone</option>
                  <option value="Hackathon">Hackathon</option>
                  <option value="Coursework Project">Coursework Project</option>
                  <option value="Research Group">Research Group</option>
                </select>
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">Final Submission Deadline</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={e => setDeadline(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-elevated-border">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-mutedText hover:text-warmWhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime text-obsidian font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

