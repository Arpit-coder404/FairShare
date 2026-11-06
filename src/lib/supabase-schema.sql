-- ============================================================================
-- FAIRSHARE DATABASE SCHEMA (PostgreSQL / Supabase)
-- Normalized multi-tenant architecture with Row-Level Security (RLS)
-- ============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  avatar_url text,
  bio text,
  role text,
  skills text[] default '{}',
  capacity_points integer default 10 check (capacity_points > 0),
  availability_hours numeric default 15,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Teams Table
create table if not exists public.teams (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  created_by uuid references public.profiles(id) on delete set null,
  invite_code text unique not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Team Members Table
create table if not exists public.team_members (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text not null default 'Contributor',
  skills text[] default '{}',
  capacity_points integer default 10 check (capacity_points > 0),
  availability_hours numeric default 15,
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(team_id, user_id)
);

-- 4. Projects Table
create table if not exists public.projects (
  id uuid default uuid_generate_v4() primary key,
  team_id uuid references public.teams(id) on delete cascade not null,
  name text not null,
  description text,
  category text default 'Capstone Project',
  status text check (status in ('planning', 'active', 'paused', 'completed')) default 'active',
  start_date date default current_date,
  deadline date not null,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Tasks Table
create table if not exists public.tasks (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  title text not null,
  description text,
  status text check (status in ('backlog', 'todo', 'in_progress', 'in_review', 'done')) default 'todo',
  priority text check (priority in ('low', 'medium', 'high', 'urgent')) default 'medium',
  estimated_effort integer default 3 check (estimated_effort between 1 and 10),
  actual_effort integer default 0,
  due_date date,
  assignee_id uuid references public.profiles(id) on delete set null,
  collaborator_ids uuid[] default '{}',
  skills_required text[] default '{}',
  dependencies uuid[] default '{}',
  is_blocked boolean default false,
  blocker_reason text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Task Comments Table
create table if not exists public.task_comments (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Deliverables Table
create table if not exists public.deliverables (
  id uuid default uuid_generate_v4() primary key,
  task_id uuid references public.tasks(id) on delete cascade not null,
  uploaded_by uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  file_url text not null,
  file_name text not null,
  file_size text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Activity Events Table
create table if not exists public.activity_events (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete set null,
  user_name text not null,
  task_id uuid references public.tasks(id) on delete set null,
  task_title text,
  event_type text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Team Pulse Table
create table if not exists public.team_pulse (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  workload_status text check (workload_status in ('manageable', 'heavy', 'overloaded')) not null,
  blocker_status text check (blocker_status in ('none', 'clarification', 'waiting_teammate', 'technical')) not null,
  feedback text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Peer Feedback Table
create table if not exists public.peer_feedback (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references public.projects(id) on delete cascade not null,
  milestone_name text not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewee_id uuid references public.profiles(id) on delete cascade not null,
  communication integer check (communication between 1 and 5) not null,
  reliability integer check (reliability between 1 and 5) not null,
  collaboration integer check (collaboration between 1 and 5) not null,
  supportiveness integer check (supportiveness between 1 and 5) not null,
  comment text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Notifications Table
create table if not exists public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null,
  title text not null,
  message text not null,
  related_entity_type text not null,
  related_entity_id text not null,
  read_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS POLICIES
alter table public.profiles enable row level security;
alter table public.teams enable row level security;
alter table public.team_members enable row level security;
alter table public.projects enable row level security;
alter table public.tasks enable row level security;
alter table public.task_comments enable row level security;
alter table public.deliverables enable row level security;
alter table public.activity_events enable row level security;
alter table public.team_pulse enable row level security;
alter table public.peer_feedback enable row level security;
alter table public.notifications enable row level security;

-- Indexing for high-performance telemetry
create index if not exists idx_tasks_project on public.tasks(project_id);
create index if not exists idx_tasks_assignee on public.tasks(assignee_id);
create index if not exists idx_events_project on public.activity_events(project_id);
create index if not exists idx_notifications_user on public.notifications(user_id, read_at);

