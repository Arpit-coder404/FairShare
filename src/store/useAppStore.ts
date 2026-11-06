import { create } from 'zustand';
import { 
  UserProfile, 
  Team, 
  TeamMember, 
  Project, 
  Task, 
  ActivityEvent, 
  TeamPulse, 
  PeerFeedback, 
  Notification, 
  TaskStatus, 
  FairnessAnalysis 
} from '../types';
import { 
  DEMO_MEMBERS, 
  DEMO_CURRENT_USER, 
  DEMO_TEAM, 
  DEMO_PROJECTS, 
  DEMO_TASKS, 
  DEMO_ACTIVITY, 
  DEMO_PULSE, 
  DEMO_PEER_FEEDBACK, 
  DEMO_NOTIFICATIONS 
} from '../data/demoData';
import { calculateFairness } from '../services/fairnessEngine';

const STORAGE_KEY = 'fairshare_state_v1';

interface AppState {
  // State
  isDemoMode: boolean;
  currentUser: UserProfile;
  team: Team;
  members: TeamMember[];
  projects: Project[];
  activeProjectId: string;
  tasks: Task[];
  activity: ActivityEvent[];
  pulse: TeamPulse[];
  peerFeedback: PeerFeedback[];
  notifications: Notification[];

  // Derived fairness
  getFairnessAnalysis: () => FairnessAnalysis;

  // Actions
  switchUser: (userId: string) => void;
  resetDemoWorkspace: () => void;
  setActiveProject: (projectId: string) => void;
  
  // Projects
  createProject: (project: { name: string; description: string; category: string; deadline: string }) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Tasks
  createTask: (taskData: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: Task['priority'];
    estimated_effort: number;
    due_date: string;
    assignee_id: string;
    skills_required?: string[];
    dependencies?: string[];
  }) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  changeTaskStatus: (id: string, status: TaskStatus) => void;
  reassignTask: (taskId: string, newAssigneeId: string) => void;
  toggleTaskBlocked: (id: string, reason?: string) => void;
  addDeliverable: (taskId: string, title: string, fileName: string) => void;
  
  // Redistribution
  executeRedistribution: (suggestionId: string) => boolean;

  // Collaboration
  addActivity: (event: Omit<ActivityEvent, 'id' | 'created_at'>) => void;
  submitPulse: (workload: 'manageable' | 'heavy' | 'overloaded', blocker: 'none' | 'clarification' | 'waiting_teammate' | 'technical', feedback: string) => void;
  submitPeerReview: (revieweeId: string, milestoneName: string, scores: { communication: number; reliability: number; collaboration: number; supportiveness: number; comment: string }) => void;
  
  // Team
  inviteMember: (memberData: { name: string; email: string; role: string; skills: string[]; capacity_points: number; availability_hours: number }) => TeamMember;
  updateMemberCapacity: (userId: string, capacity: number) => void;
  createTeamAndProject: (teamName: string, projectName: string, description: string, category: string, deadline: string) => void;
  joinTeamWithCode: (code: string) => boolean;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
}

const loadSavedState = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Failed to parse saved state:', err);
  }
  return null;
};

const initialSaved = loadSavedState();

export const useAppStore = create<AppState>((set, get) => ({
  isDemoMode: true,
  currentUser: initialSaved?.currentUser || DEMO_CURRENT_USER,
  team: initialSaved?.team || DEMO_TEAM,
  members: initialSaved?.members || DEMO_MEMBERS,
  projects: initialSaved?.projects || DEMO_PROJECTS,
  activeProjectId: initialSaved?.activeProjectId || DEMO_PROJECTS[0].id,
  tasks: initialSaved?.tasks || DEMO_TASKS,
  activity: initialSaved?.activity || DEMO_ACTIVITY,
  pulse: initialSaved?.pulse || DEMO_PULSE,
  peerFeedback: initialSaved?.peerFeedback || DEMO_PEER_FEEDBACK,
  notifications: initialSaved?.notifications || DEMO_NOTIFICATIONS,

  getFairnessAnalysis: () => {
    const state = get();
    const activeTasks = state.tasks.filter(t => t.project_id === state.activeProjectId);
    return calculateFairness(activeTasks, state.members);
  },

  switchUser: (userId: string) => {
    const member = get().members.find(m => m.user_id === userId);
    if (!member) return;

    const updatedUser: UserProfile = {
      id: member.user_id,
      full_name: member.name,
      email: member.email,
      avatar_url: member.avatar_url,
      bio: `Active contributor on ${get().team.name}. Specializing in ${member.role}.`,
      role: member.role,
      skills: member.skills,
      capacity_points: member.capacity_points,
      availability_hours: member.availability_hours,
    };

    set({ currentUser: updatedUser });
    saveToStorage(get());
  },

  resetDemoWorkspace: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (_) {}

    set({
      isDemoMode: true,
      currentUser: DEMO_CURRENT_USER,
      team: DEMO_TEAM,
      members: DEMO_MEMBERS,
      projects: DEMO_PROJECTS,
      activeProjectId: DEMO_PROJECTS[0].id,
      tasks: DEMO_TASKS,
      activity: DEMO_ACTIVITY,
      pulse: DEMO_PULSE,
      peerFeedback: DEMO_PEER_FEEDBACK,
      notifications: DEMO_NOTIFICATIONS,
    });
  },

  setActiveProject: (projectId: string) => {
    set({ activeProjectId: projectId });
    saveToStorage(get());
  },

  createProject: ({ name, description, category, deadline }) => {
    const state = get();
    const newProj: Project = {
      id: `proj-${Date.now()}`,
      team_id: state.team.id,
      name,
      description,
      category,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      deadline: deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_by: state.currentUser.id,
      created_at: new Date().toISOString(),
    };

    set({
      projects: [newProj, ...state.projects],
      activeProjectId: newProj.id,
    });
    saveToStorage(get());
    return newProj;
  },

  updateProject: (id: string, updates: Partial<Project>) => {
    set(state => ({
      projects: state.projects.map(p => p.id === id ? { ...p, ...updates } : p)
    }));
    saveToStorage(get());
  },

  deleteProject: (id: string) => {
    set(state => {
      const remaining = state.projects.filter(p => p.id !== id);
      const newActive = remaining.length > 0 ? remaining[0].id : '';
      return {
        projects: remaining,
        activeProjectId: state.activeProjectId === id ? newActive : state.activeProjectId,
        tasks: state.tasks.filter(t => t.project_id !== id)
      };
    });
    saveToStorage(get());
  },

  createTask: (data) => {
    const state = get();
    const newTask: Task = {
      id: `task-${Date.now()}`,
      project_id: state.activeProjectId,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      estimated_effort: data.estimated_effort,
      actual_effort: 0,
      due_date: data.due_date,
      assignee_id: data.assignee_id,
      collaborator_ids: [],
      skills_required: data.skills_required || [],
      dependencies: data.dependencies || [],
      is_blocked: false,
      deliverables: [],
      created_by: state.currentUser.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const assignee = state.members.find(m => m.user_id === data.assignee_id);

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: state.activeProjectId,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      task_id: newTask.id,
      task_title: newTask.title,
      event_type: 'task_created',
      metadata: { effort: data.estimated_effort, assignedTo: assignee?.name || 'Unassigned' },
      created_at: new Date().toISOString(),
    };

    set({
      tasks: [newTask, ...state.tasks],
      activity: [newActivity, ...state.activity],
    });
    saveToStorage(get());
    return newTask;
  },

  updateTask: (id: string, updates: Partial<Task>) => {
    set(state => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t)
    }));
    saveToStorage(get());
  },

  deleteTask: (id: string) => {
    set(state => ({
      tasks: state.tasks.filter(t => t.id !== id)
    }));
    saveToStorage(get());
  },

  changeTaskStatus: (id: string, status: TaskStatus) => {
    const state = get();
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const isDone = status === 'done';
    const updatedTasks = state.tasks.map(t => 
      t.id === id 
        ? { 
            ...t, 
            status, 
            actual_effort: isDone ? (t.actual_effort || t.estimated_effort) : t.actual_effort,
            updated_at: new Date().toISOString() 
          } 
        : t
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: task.project_id,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      task_id: task.id,
      task_title: task.title,
      event_type: isDone ? 'task_completed' : 'status_changed',
      metadata: { from: task.status, to: status, effort: task.estimated_effort },
      created_at: new Date().toISOString(),
    };

    set({
      tasks: updatedTasks,
      activity: [newActivity, ...state.activity],
    });
    saveToStorage(get());
  },

  reassignTask: (taskId: string, newAssigneeId: string) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    const newAssignee = state.members.find(m => m.user_id === newAssigneeId);
    if (!task || !newAssignee) return;

    const oldAssignee = state.members.find(m => m.user_id === task.assignee_id);

    const updatedTasks = state.tasks.map(t =>
      t.id === taskId ? { ...t, assignee_id: newAssigneeId, updated_at: new Date().toISOString() } : t
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: task.project_id,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      task_id: task.id,
      task_title: task.title,
      event_type: 'rebalanced',
      metadata: { from: oldAssignee?.name || 'Previous', to: newAssignee.name, effort: task.estimated_effort },
      created_at: new Date().toISOString(),
    };

    set({
      tasks: updatedTasks,
      activity: [newActivity, ...state.activity],
    });
    saveToStorage(get());
  },

  executeRedistribution: (suggestionId: string) => {
    const state = get();
    const analysis = state.getFairnessAnalysis();
    const suggestion = analysis.suggested_redistributions.find(s => s.id === suggestionId);
    if (!suggestion) return false;

    state.reassignTask(suggestion.task_id, suggestion.to_user_id);
    return true;
  },

  toggleTaskBlocked: (id: string, reason?: string) => {
    const state = get();
    const task = state.tasks.find(t => t.id === id);
    if (!task) return;

    const nextBlocked = !task.is_blocked;
    const updatedTasks = state.tasks.map(t =>
      t.id === id ? { 
        ...t, 
        is_blocked: nextBlocked, 
        blocker_reason: nextBlocked ? (reason || 'Blocked on pending dependency') : undefined,
        updated_at: new Date().toISOString()
      } : t
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: task.project_id,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      task_id: task.id,
      task_title: task.title,
      event_type: 'task_blocked',
      metadata: { isBlocked: nextBlocked, reason },
      created_at: new Date().toISOString(),
    };

    set({
      tasks: updatedTasks,
      activity: [newActivity, ...state.activity]
    });
    saveToStorage(get());
  },

  addDeliverable: (taskId: string, title: string, fileName: string) => {
    const state = get();
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const newDeliverable = {
      id: `del-${Date.now()}`,
      task_id: taskId,
      title,
      file_url: '#',
      file_name: fileName,
      file_size: '124 KB',
      uploaded_by: state.currentUser.id,
      uploader_name: state.currentUser.full_name,
      created_at: new Date().toISOString(),
    };

    const updatedTasks = state.tasks.map(t =>
      t.id === taskId ? { ...t, deliverables: [...t.deliverables, newDeliverable] } : t
    );

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: task.project_id,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      task_id: task.id,
      task_title: task.title,
      event_type: 'deliverable_uploaded',
      metadata: { title, fileName },
      created_at: new Date().toISOString(),
    };

    set({
      tasks: updatedTasks,
      activity: [newActivity, ...state.activity],
    });
    saveToStorage(get());
  },

  addActivity: (event) => {
    const newEvent: ActivityEvent = {
      ...event,
      id: `act-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    set(state => ({
      activity: [newEvent, ...state.activity]
    }));
    saveToStorage(get());
  },

  submitPulse: (workload, blocker, feedback) => {
    const state = get();
    const newPulse: TeamPulse = {
      id: `pulse-${Date.now()}`,
      project_id: state.activeProjectId,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      workload_status: workload,
      blocker_status: blocker,
      feedback,
      created_at: new Date().toISOString(),
    };

    const newActivity: ActivityEvent = {
      id: `act-${Date.now()}`,
      project_id: state.activeProjectId,
      user_id: state.currentUser.id,
      user_name: state.currentUser.full_name,
      user_avatar: state.currentUser.avatar_url,
      event_type: 'pulse_submitted',
      metadata: { workload, blocker },
      created_at: new Date().toISOString(),
    };

    set({
      pulse: [newPulse, ...state.pulse.filter(p => !(p.project_id === state.activeProjectId && p.user_id === state.currentUser.id))],
      activity: [newActivity, ...state.activity],
    });
    saveToStorage(get());
  },

  submitPeerReview: (revieweeId, milestoneName, scores) => {
    const state = get();
    const reviewee = state.members.find(m => m.user_id === revieweeId);
    if (!reviewee) return;

    const newReview: PeerFeedback = {
      id: `fb-${Date.now()}`,
      project_id: state.activeProjectId,
      milestone_name: milestoneName,
      reviewer_id: state.currentUser.id,
      reviewer_name: state.currentUser.full_name,
      reviewee_id: revieweeId,
      reviewee_name: reviewee.name,
      communication: scores.communication,
      reliability: scores.reliability,
      collaboration: scores.collaboration,
      supportiveness: scores.supportiveness,
      comment: scores.comment,
      created_at: new Date().toISOString(),
    };

    set({
      peerFeedback: [newReview, ...state.peerFeedback],
    });
    saveToStorage(get());
  },

  inviteMember: (data) => {
    const state = get();
    const newMember: TeamMember = {
      id: `member-${Date.now()}`,
      team_id: state.team.id,
      user_id: `user-${Date.now()}`,
      name: data.name,
      email: data.email,
      avatar_url: `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 500000)}?w=150&auto=format&fit=crop&q=80`,
      role: data.role,
      skills: data.skills,
      capacity_points: data.capacity_points || 10,
      availability_hours: data.availability_hours || 15,
      joined_at: new Date().toISOString(),
    };

    set({
      members: [...state.members, newMember]
    });
    saveToStorage(get());
    return newMember;
  },

  updateMemberCapacity: (userId: string, capacity: number) => {
    set(state => ({
      members: state.members.map(m => m.user_id === userId ? { ...m, capacity_points: capacity } : m)
    }));
    saveToStorage(get());
  },

  createTeamAndProject: (teamName, projectName, description, category, deadline) => {
    const state = get();
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: teamName,
      created_by: state.currentUser.id,
      invite_code: `FAIR-${Math.floor(1000 + Math.random() * 9000)}`,
      created_at: new Date().toISOString(),
    };

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      team_id: newTeam.id,
      name: projectName,
      description,
      category,
      status: 'active',
      start_date: new Date().toISOString().split('T')[0],
      deadline,
      created_by: state.currentUser.id,
      created_at: new Date().toISOString(),
    };

    set({
      team: newTeam,
      projects: [newProject, ...state.projects],
      activeProjectId: newProject.id,
    });
    saveToStorage(get());
  },

  joinTeamWithCode: (code: string) => {
    // If demo code or any valid 4+ char code entered
    if (!code || code.trim().length < 3) return false;
    return true;
  },

  markNotificationAsRead: (id: string) => {
    set(state => ({
      notifications: state.notifications.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
    }));
    saveToStorage(get());
  },

  markAllNotificationsAsRead: () => {
    set(state => ({
      notifications: state.notifications.map(n => ({ ...n, read_at: new Date().toISOString() }))
    }));
    saveToStorage(get());
  },
}));

function saveToStorage(state: AppState) {
  try {
    const toSave = {
      currentUser: state.currentUser,
      team: state.team,
      members: state.members,
      projects: state.projects,
      activeProjectId: state.activeProjectId,
      tasks: state.tasks,
      activity: state.activity,
      pulse: state.pulse,
      peerFeedback: state.peerFeedback,
      notifications: state.notifications,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch (err) {
    console.error('Failed to save state to localStorage:', err);
  }
}

