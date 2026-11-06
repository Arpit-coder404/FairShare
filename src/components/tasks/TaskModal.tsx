import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Task, TaskPriority, TaskStatus } from '../../types';
import { X, Sparkles, User, Calendar, AlertCircle, ShieldAlert, Check } from 'lucide-react';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({ isOpen, onClose, initialTask }) => {
  const { 
    members, 
    tasks, 
    activeProjectId, 
    createTask, 
    updateTask, 
    getFairnessAnalysis 
  } = useAppStore();

  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || 'todo');
  const [priority, setPriority] = useState<TaskPriority>(initialTask?.priority || 'medium');
  const [estimatedEffort, setEstimatedEffort] = useState<number>(initialTask?.estimated_effort || 4);
  const [dueDate, setDueDate] = useState(
    initialTask?.due_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [assigneeId, setAssigneeId] = useState(initialTask?.assignee_id || members[0]?.user_id || '');
  const [selectedSkills, setSelectedSkills] = useState<string[]>(initialTask?.skills_required || []);
  const [skillInput, setSkillInput] = useState('');
  const [dependencies, setDependencies] = useState<string[]>(initialTask?.dependencies || []);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const analysis = getFairnessAnalysis();
  const activeTasks = tasks.filter(t => t.project_id === activeProjectId);

  // Compute Smart Assignment Recommendation based on effort, capacity, skills, and existing load
  const recommendedCandidates = members.map(m => {
    const memberMetric = analysis.member_metrics.find(mm => mm.user_id === m.user_id);
    const assigned = memberMetric?.assigned_effort || 0;
    const capacity = m.capacity_points;
    const remaining = Math.max(0, capacity - assigned);

    // Score skill matches
    const matchedSkills = selectedSkills.filter(s => 
      m.skills.some(ms => ms.toLowerCase().includes(s.toLowerCase()))
    );

    let score = remaining * 2; // base score on capacity
    score += matchedSkills.length * 5; // boost for skill match
    if (assigned + estimatedEffort > capacity) {
      score -= 20; // heavy penalty if it pushes them into overload
    }

    return {
      member: m,
      remaining,
      assigned,
      matchedSkills,
      score,
      willOverload: assigned + estimatedEffort > capacity,
    };
  }).sort((a, b) => b.score - a.score);

  const topRecommendation = recommendedCandidates[0];

  const handleAddSkill = () => {
    if (skillInput.trim() && !selectedSkills.includes(skillInput.trim())) {
      setSelectedSkills([...selectedSkills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setSelectedSkills(selectedSkills.filter(s => s !== skill));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    if (initialTask) {
      updateTask(initialTask.id, {
        title,
        description,
        status,
        priority,
        estimated_effort: Number(estimatedEffort),
        due_date: dueDate,
        assignee_id: assigneeId,
        skills_required: selectedSkills,
        dependencies,
      });
    } else {
      createTask({
        title,
        description,
        status,
        priority,
        estimated_effort: Number(estimatedEffort),
        due_date: dueDate,
        assignee_id: assigneeId,
        skills_required: selectedSkills,
        dependencies,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-elevated border border-elevated-border rounded-2xl w-full max-w-2xl my-8 overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-elevated-border flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-display text-warmWhite">
              {initialTask ? 'Edit Task' : 'Create New Task'}
            </h3>
            <p className="text-xs text-mutedText mt-0.5">
              Specify effort points and dependencies to maintain accurate team fairness metrics.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-mutedText hover:text-warmWhite hover:bg-midnight transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-coral/15 border border-coral/30 text-coral text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-warmWhite block mb-1.5">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={e => { setTitle(e.target.value); setError(''); }}
              placeholder="e.g. Implement Responsive Navigation & Drawer"
              className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-semibold text-warmWhite block mb-1.5">
              Description & Deliverable Expectation
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Provide clear technical context, expected artifact (PDF/code/figma), and acceptance criteria..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all"
            />
          </div>

          {/* Grid: Effort Points & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-warmWhite block mb-1.5">
                Effort Points (1 - 10) *
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={estimatedEffort}
                  onChange={e => setEstimatedEffort(Number(e.target.value))}
                  className="w-full accent-lime cursor-pointer"
                />
                <span className="w-10 text-center px-2 py-1 bg-midnight border border-elevated-border font-mono font-bold text-xs text-lime rounded-lg">
                  {estimatedEffort}p
                </span>
              </div>
              <span className="text-[10px] text-mutedText mt-1 block">
                {estimatedEffort <= 3 ? 'Small task' : estimatedEffort <= 6 ? 'Medium effort' : 'Substantial deliverable'}
              </span>
            </div>

            <div>
              <label className="text-xs font-semibold text-warmWhite block mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as TaskPriority)}
                className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-warmWhite block mb-1.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all"
              >
              </input>
            </div>
          </div>

          {/* Smart Task Distribution Suggestion Box */}
          <div className="p-4 rounded-xl bg-midnight border border-elevated-border relative">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-warmWhite flex items-center gap-1.5 font-display">
                <Sparkles className="w-3.5 h-3.5 text-lime" /> Smart Assignment Recommendation
              </span>
              <span className="text-[10px] font-mono text-mutedText uppercase tracking-wider">
                Fairness Guided
              </span>
            </div>

            {topRecommendation && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-elevated/60 p-3 rounded-lg border border-elevated-border">
                <div className="flex items-center gap-2.5">
                  <img
                    src={topRecommendation.member.avatar_url}
                    alt={topRecommendation.member.name}
                    className="w-8 h-8 rounded-full object-cover border border-lime"
                  />
                  <div>
                    <span className="text-xs font-bold text-warmWhite block">
                      Recommended: {topRecommendation.member.name}
                    </span>
                    <span className="text-[11px] text-mutedText block">
                      Has {topRecommendation.remaining} pts remaining capacity
                      {topRecommendation.matchedSkills.length > 0 && ` • Matches skills: ${topRecommendation.matchedSkills.join(', ')}`}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAssigneeId(topRecommendation.member.user_id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shrink-0 ${
                    assigneeId === topRecommendation.member.user_id
                      ? 'bg-lime text-obsidian shadow-sm'
                      : 'bg-elevated hover:bg-elevated-hover text-lime border border-lime/30'
                  }`}
                >
                  {assigneeId === topRecommendation.member.user_id ? 'Selected' : 'Apply Suggestion'}
                </button>
              </div>
            )}

            {/* Manual Assignee Selector Override */}
            <div className="mt-3">
              <label className="text-[11px] text-mutedText block mb-1">
                Assignee (Manual Override)
              </label>
              <select
                value={assigneeId}
                onChange={e => setAssigneeId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-elevated border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all"
              >
                {members.map(m => {
                  const mMetric = analysis.member_metrics.find(mm => mm.user_id === m.user_id);
                  const currentEffort = mMetric?.assigned_effort || 0;
                  return (
                    <option key={m.user_id} value={m.user_id}>
                      {m.name} — ({m.role}) • {currentEffort}/{m.capacity_points} pts currently assigned
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          {/* Skills Required Tags */}
          <div>
            <label className="text-xs font-semibold text-warmWhite block mb-1.5">
              Required Skills
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillInput}
                onChange={e => setSkillInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddSkill(); } }}
                placeholder="Type skill & press Enter (e.g. React, Testing, Figma)"
                className="flex-1 px-3 py-1.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-3 py-1.5 bg-elevated hover:bg-elevated-hover border border-elevated-border text-xs text-warmWhite rounded-xl"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedSkills.map(skill => (
                <span
                  key={skill}
                  className="px-2.5 py-1 text-xs rounded-lg bg-midnight border border-elevated-border text-warmWhite flex items-center gap-1.5"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-mutedText hover:text-coral"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Task Dependencies */}
          <div>
            <label className="text-xs font-semibold text-warmWhite block mb-1.5">
              Dependencies (Upstream Tasks required first)
            </label>
            <select
              multiple
              value={dependencies}
              onChange={e => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setDependencies(selected);
              }}
              className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime transition-all max-h-24"
            >
              {activeTasks
                .filter(t => !initialTask || t.id !== initialTask.id)
                .map(t => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.status}) — {t.estimated_effort} pts
                  </option>
                ))}
            </select>
            <span className="text-[10px] text-mutedText mt-1 block">
              Hold Cmd/Ctrl to select multiple dependent tasks.
            </span>
          </div>

          {/* Action buttons */}
          <div className="pt-3 border-t border-elevated-border flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-elevated-border text-xs text-mutedText hover:text-warmWhite hover:bg-midnight transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-lime text-obsidian text-xs font-bold hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              {initialTask ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

