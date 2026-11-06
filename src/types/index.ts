export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'in_review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ProjectStatus = 'planning' | 'active' | 'paused' | 'completed';

export interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  avatar_url: string;
  bio: string;
  role: string;
  skills: string[];
  capacity_points: number; // e.g. 10 effort points per sprint
  availability_hours: number;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  created_by: string;
  invite_code: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  name: string;
  email: string;
  avatar_url: string;
  role: string;
  skills: string[];
  capacity_points: number;
  availability_hours: number;
  joined_at: string;
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description: string;
  category: string;
  status: ProjectStatus;
  start_date: string;
  deadline: string;
  created_by: string;
  created_at: string;
}

export interface Deliverable {
  id: string;
  task_id: string;
  title: string;
  file_url: string;
  file_name: string;
  file_size?: string;
  uploaded_by: string;
  uploader_name: string;
  created_at: string;
}

export interface TaskComment {
  id: string;
  task_id: string;
  user_id: string;
  user_name: string;
  user_avatar: string;
  content: string;
  created_at: string;
}

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  estimated_effort: number; // 1 to 10 points
  actual_effort: number;
  due_date: string;
  assignee_id: string; // User ID
  collaborator_ids: string[];
  skills_required: string[];
  dependencies: string[]; // Task IDs this depends on
  is_blocked: boolean;
  blocker_reason?: string;
  deliverables: Deliverable[];
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityEvent {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  user_avatar?: string;
  task_id?: string;
  task_title?: string;
  event_type: 
    | 'task_created' 
    | 'task_completed' 
    | 'deliverable_uploaded' 
    | 'comment_added' 
    | 'rebalanced' 
    | 'status_changed' 
    | 'task_blocked'
    | 'pulse_submitted';
  metadata: Record<string, any>;
  created_at: string;
}

export interface TeamPulse {
  id: string;
  project_id: string;
  user_id: string;
  user_name: string;
  workload_status: 'manageable' | 'heavy' | 'overloaded';
  blocker_status: 'none' | 'clarification' | 'waiting_teammate' | 'technical';
  feedback: string;
  created_at: string;
}

export interface PeerFeedback {
  id: string;
  project_id: string;
  milestone_name: string;
  reviewer_id: string;
  reviewer_name: string;
  reviewee_id: string;
  reviewee_name: string;
  communication: number; // 1 - 5
  reliability: number;
  collaboration: number;
  supportiveness: number;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 
    | 'task_assigned' 
    | 'task_due_soon' 
    | 'task_overdue' 
    | 'task_blocked' 
    | 'mention' 
    | 'new_comment' 
    | 'team_invitation' 
    | 'milestone_completed' 
    | 'rebalancing_proposal';
  title: string;
  message: string;
  related_entity_type: 'task' | 'project' | 'team';
  related_entity_id: string;
  read_at?: string | null;
  created_at: string;
}

export interface MemberMetric {
  user_id: string;
  name: string;
  role: string;
  avatar_url: string;
  capacity_points: number;
  assigned_effort: number;
  completed_effort: number;
  remaining_effort: number;
  active_tasks_count: number;
  completed_tasks_count: number;
  blocked_tasks_count: number;
  overdue_tasks_count: number;
  utilization_pct: number; // (assigned_effort / capacity) * 100
  load_status: 'underutilized' | 'optimal' | 'stretched' | 'overloaded';
  skills: string[];
}

export interface FairnessInsight {
  id: string;
  category: 'imbalance' | 'capacity' | 'blocker' | 'deadline' | 'dependency' | 'achievement';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  explanation: string;
  supporting_data: string;
  suggested_action?: string;
  target_task_id?: string;
  target_user_id?: string;
}

export interface SuggestedRedistribution {
  id: string;
  task_id: string;
  task_title: string;
  task_effort: number;
  from_user_id: string;
  from_user_name: string;
  to_user_id: string;
  to_user_name: string;
  reason: string;
  before_from_effort: number;
  after_from_effort: number;
  before_to_effort: number;
  after_to_effort: number;
  match_skills: string[];
}

export interface FairnessAnalysis {
  balance_score: number; // 0 - 100
  balance_status: 'Optimal' | 'Balanced' | 'Moderate Imbalance' | 'Severe Imbalance';
  total_effort: number;
  completed_effort: number;
  remaining_effort: number;
  average_effort_per_member: number;
  completion_rate: number; // percentage
  member_metrics: MemberMetric[];
  insights: FairnessInsight[];
  suggested_redistributions: SuggestedRedistribution[];
  bottlenecks: Task[];
  calculated_at: string;
}

