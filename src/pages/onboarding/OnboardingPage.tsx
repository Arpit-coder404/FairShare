import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Scale, Users, Plus, Key, ArrowRight, Check, Sparkles } from 'lucide-react';

export const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { createTeamAndProject, joinTeamWithCode, team } = useAppStore();

  const [mode, setMode] = useState<'create' | 'join'>('create');
  const [step, setStep] = useState(1);

  // Form states
  const [teamName, setTeamName] = useState('');
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Senior Capstone');
  const [deadline, setDeadline] = useState(
    new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState('');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamName.trim() || !projectName.trim()) {
      setError('Please provide both team and project names.');
      return;
    }

    createTeamAndProject(teamName, projectName, description, category, deadline);
    navigate('/app');
  };

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      setError('Enter a valid team invitation code.');
      return;
    }

    const ok = joinTeamWithCode(inviteCode);
    if (ok) {
      navigate('/app');
    } else {
      setError('Invalid or expired invite code.');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian text-warmWhite flex flex-col justify-between p-6 sm:p-12">
      {/* Brand Header */}
      <div className="flex items-center justify-between max-w-4xl mx-auto w-full">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-xl bg-lime/15 border border-lime/30 flex items-center justify-center text-lime group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg font-display tracking-tight text-warmWhite">
            FairShare
          </span>
        </div>

        <button
          onClick={() => navigate('/app')}
          className="text-xs text-mutedText hover:text-warmWhite font-mono"
        >
          Skip to Demo Workspace →
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-xl mx-auto w-full my-8">
        <div className="surface-elevated rounded-3xl p-6 sm:p-10 border border-elevated-border shadow-2xl relative">
          {/* Progress Indicator */}
          <div className="flex items-center justify-between gap-2 mb-8 pb-6 border-b border-elevated-border">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-lime font-bold block mb-1">
                STEP {mode === 'create' ? step : '1'} OF {mode === 'create' ? '2' : '1'}
              </span>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-warmWhite">
                {mode === 'create' ? 'Assemble Your Team' : 'Join Existing Team'}
              </h2>
            </div>

            <div className="flex items-center gap-1.5 bg-midnight p-1 rounded-xl border border-elevated-border">
              <button
                type="button"
                onClick={() => { setMode('create'); setError(''); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'create' ? 'bg-elevated text-lime shadow-sm' : 'text-mutedText hover:text-warmWhite'
                }`}
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => { setMode('join'); setError(''); }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  mode === 'join' ? 'bg-elevated text-lime shadow-sm' : 'text-mutedText hover:text-warmWhite'
                }`}
              >
                Join
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 mb-4 rounded-xl bg-coral/15 border border-coral/30 text-coral text-xs">
              {error}
            </div>
          )}

          {/* CREATE TEAM FLOW */}
          {mode === 'create' && (
            <form onSubmit={handleCreateSubmit} className="space-y-5 text-xs">
              {step === 1 ? (
                <>
                  <div>
                    <label className="text-warmWhite font-semibold block mb-1.5">
                      Team or Working Group Name *
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={e => setTeamName(e.target.value)}
                      placeholder="e.g. Project Nebula, Team Apollo, Capstone Group 4"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-warmWhite font-semibold block mb-1.5">
                      Academic / Project Category
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                    >
                      <option value="Senior Capstone">Senior Capstone</option>
                      <option value="Hackathon Team">Hackathon Team</option>
                      <option value="Research Group">Academic Research Lab</option>
                      <option value="Undergraduate Coursework">Undergraduate Coursework</option>
                    </select>
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        if (!teamName.trim()) {
                          setError('Please enter your team name.');
                          return;
                        }
                        setError('');
                        setStep(2);
                      }}
                      className="px-5 py-2.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime flex items-center gap-1.5"
                    >
                      <span>Continue to Project Details</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="text-warmWhite font-semibold block mb-1.5">
                      First Project / Deliverable Name *
                    </label>
                    <input
                      type="text"
                      value={projectName}
                      onChange={e => setProjectName(e.target.value)}
                      placeholder="e.g. Autonomous Campus Delivery Rover"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-warmWhite font-semibold block mb-1.5">
                      Project Objective & Scope
                    </label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Brief summary of required deliverables, papers, or codebase..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                    />
                  </div>

                  <div>
                    <label className="text-warmWhite font-semibold block mb-1.5">
                      Target Final Presentation Deadline
                    </label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={e => setDeadline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                    />
                  </div>

                  <div className="pt-4 flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-4 py-2 text-mutedText hover:text-warmWhite"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime flex items-center gap-1.5"
                    >
                      <Check className="w-4 h-4" /> Launch Team Workspace
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {/* JOIN TEAM FLOW */}
          {mode === 'join' && (
            <form onSubmit={handleJoinSubmit} className="space-y-5 text-xs">
              <div>
                <label className="text-warmWhite font-semibold block mb-1.5">
                  Enter 6-Character Invitation Code
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value.toUpperCase())}
                    placeholder="e.g. NEBULA-2026 or FAIR-4892"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite font-mono font-bold tracking-wider focus:border-lime uppercase"
                    required
                  />
                </div>
                <span className="text-[10px] text-mutedText mt-1.5 block">
                  Tip: Use demo code <code className="text-lime">NEBULA-2026</code> to join Project Nebula immediately.
                </span>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime flex items-center gap-1.5"
                >
                  <span>Verify & Join Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="text-center text-xs text-mutedText">
        FairShare — Making teamwork actually work.
      </div>
    </div>
  );
};

