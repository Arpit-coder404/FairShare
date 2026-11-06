import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';

// Pages
import { LandingPage } from './pages/landing/LandingPage';
import { AuthPage } from './pages/auth/AuthPage';
import { OnboardingPage } from './pages/onboarding/OnboardingPage';
import { WorkspaceOverviewPage } from './pages/workspace/WorkspaceOverviewPage';
import { ProjectsListPage } from './pages/projects/ProjectsListPage';
import { ProjectOverviewPage } from './pages/projects/ProjectOverviewPage';
import { TaskBoardPage } from './pages/tasks/TaskBoardPage';
import { FairnessPage } from './pages/fairness/FairnessPage';
import { TeamPage } from './pages/team/TeamPage';
import { TimelinePage } from './pages/timeline/TimelinePage';
import { InsightsPage } from './pages/insights/InsightsPage';
import { InboxPage } from './pages/inbox/InboxPage';
import { ProfilePage } from './pages/profile/ProfilePage';
import { SettingsPage } from './pages/settings/SettingsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />

        {/* Authenticated Workspace Persistent Shell Routes */}
        <Route path="/app" element={<AppShell />}>
          <Route index element={<WorkspaceOverviewPage />} />
          <Route path="projects" element={<ProjectsListPage />} />
          <Route path="projects/:id" element={<ProjectOverviewPage />} />
          <Route path="projects/:id/board" element={<TaskBoardPage />} />
          <Route path="projects/:id/fairness" element={<FairnessPage />} />
          <Route path="projects/:id/team" element={<TeamPage />} />
          <Route path="projects/:id/timeline" element={<TimelinePage />} />
          <Route path="projects/:id/insights" element={<InsightsPage />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

