import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Settings, 
  RotateCcw, 
  Database, 
  ShieldCheck, 
  EyeOff, 
  Lock, 
  Server, 
  Check, 
  ExternalLink 
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { resetDemoWorkspace, isDemoMode, team } = useAppStore();
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleReset = () => {
    if (window.confirm('Reset the workspace state back to baseline Project Nebula demo?')) {
      resetDemoWorkspace();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-warmWhite">
          Workspace Settings & Architecture
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Configure local demo state persistence, cloud database adapters, and ethical privacy policies.
        </p>
      </div>

      {resetSuccess && (
        <div className="p-3.5 bg-lime/15 border border-lime/30 rounded-2xl text-xs text-lime font-medium flex items-center gap-2">
          <Check className="w-4 h-4" /> Demo workspace restored to factory baseline.
        </div>
      )}

      {/* Persistence & Demo Mode Management */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border space-y-5">
        <div className="flex items-center justify-between pb-4 border-b border-elevated-border">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
              <h3 className="text-base font-bold font-display text-warmWhite">
                Active Persistence Engine
              </h3>
            </div>
            <p className="text-xs text-mutedText mt-0.5">
              Current environment: <span className="text-warmWhite font-mono font-semibold">Local Demo Storage (Zero-dependency LocalStorage)</span>
            </p>
          </div>

          <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg bg-midnight text-lime border border-elevated-border">
            LOCAL ACTIVE
          </span>
        </div>

        <p className="text-xs text-mutedText leading-relaxed">
          FairShare is running in self-contained Local Demo Mode with complete localStorage persistence. All tasks, deliverable attachments, peer feedback, and fairness scores persist automatically across page reloads.
        </p>

        <div className="pt-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 bg-coral/15 hover:bg-coral/25 text-coral border border-coral/30 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" /> Reset Demo Workspace
          </button>
        </div>
      </div>

      {/* Supabase Production Integration Blueprint */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-elevated-border">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-softBlue" />
            <div>
              <h3 className="text-base font-bold font-display text-warmWhite">
                Supabase Backend Readiness
              </h3>
              <p className="text-xs text-mutedText">
                PostgreSQL schema, Row Level Security, and Realtime WebSocket replication ready.
              </p>
            </div>
          </div>
          <span className="px-2.5 py-0.5 text-[10px] font-mono rounded bg-midnight border border-elevated-border text-mutedText">
            SCHEMA MAPPED
          </span>
        </div>

        <p className="text-xs text-mutedText leading-relaxed">
          The service architecture cleanly mirrors Supabase tables: <code>profiles</code>, <code>teams</code>, <code>team_members</code>, <code>projects</code>, <code>tasks</code>, <code>task_dependencies</code>, <code>team_pulse</code>, and <code>peer_feedback</code>.
        </p>

        <div className="p-4 bg-midnight rounded-2xl border border-elevated-border text-xs font-mono space-y-1 text-mutedText">
          <div><span className="text-lime">VITE_SUPABASE_URL</span>=https://your-project.supabase.co</div>
          <div><span className="text-lime">VITE_SUPABASE_ANON_KEY</span>=eyJhbGciOiJIUzI1Ni...</div>
        </div>
      </div>

      {/* Ethical Collaboration & Anti-Surveillance Guarantee */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border space-y-4">
        <div className="flex items-center gap-2 pb-3 border-b border-elevated-border text-warmWhite">
          <ShieldCheck className="w-5 h-5 text-lime" />
          <h3 className="text-base font-bold font-display">
            Anti-Surveillance & Psychological Safety Standards
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-mutedText leading-relaxed">
          <div className="p-4 bg-midnight rounded-2xl border border-elevated-border space-y-1.5">
            <span className="text-warmWhite font-bold block flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-lime" /> Zero Activity Spyware
            </span>
            <p>
              FairShare never tracks keystrokes, browser windows, mouse motion, or infer contribution from online green dots. Work is measured solely by explicit deliverable outcomes.
            </p>
          </div>

          <div className="p-4 bg-midnight rounded-2xl border border-elevated-border space-y-1.5">
            <span className="text-warmWhite font-bold block flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-lime" /> No Public Shame Leaderboards
            </span>
            <p>
              Fairness scores reflect team health, not individual grades. Peer reviews are private by default to encourage candid, constructive collaboration rather than punitive blame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

