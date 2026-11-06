import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { Scale, Mail, Lock, ArrowRight, Check, User, Sparkles } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const { members, switchUser, currentUser } = useAppStore();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('maya@nebula.edu');
  const [password, setPassword] = useState('demo1234');
  const [fullName, setFullName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/app');
  };

  const handleSelectDemoUser = (userId: string) => {
    switchUser(userId);
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-obsidian text-warmWhite flex flex-col justify-between p-6 sm:p-12 relative overflow-hidden">
      {/* Subtle ambient blur */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Brand Header */}
      <div className="flex items-center justify-between max-w-5xl mx-auto w-full z-10">
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
          className="text-xs text-lime font-mono hover:underline flex items-center gap-1"
        >
          <span>Direct Launch Workspace</span> <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Auth Card Container */}
      <div className="max-w-md mx-auto w-full my-8 z-10">
        <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border shadow-2xl space-y-6">
          <div className="text-center">
            <span className="px-2.5 py-0.5 text-[10px] font-mono uppercase tracking-widest text-lime font-bold rounded-full bg-lime/10 border border-lime/20 inline-block mb-2">
              LOCAL DEMO PERSISTED
            </span>
            <h2 className="text-2xl font-bold font-display text-warmWhite">
              {mode === 'signin' ? 'Sign in to FairShare' : 'Create Student Account'}
            </h2>
            <p className="text-xs text-mutedText mt-1">
              Select any demo persona below or sign in with your credentials.
            </p>
          </div>

          {/* Quick 1-Click Demo Personas */}
          <div className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
              One-Click Demo Personas
            </span>
            <div className="grid grid-cols-1 gap-2">
              {members.slice(0, 3).map(m => (
                <button
                  key={m.user_id}
                  type="button"
                  onClick={() => handleSelectDemoUser(m.user_id)}
                  className="p-2.5 bg-midnight hover:bg-midnight/80 rounded-xl border border-elevated-border flex items-center justify-between text-left transition-all group hover:border-lime/40"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <img src={m.avatar_url} alt={m.name} className="w-7 h-7 rounded-full object-cover border border-elevated-border" />
                    <div className="truncate">
                      <span className="text-xs font-bold text-warmWhite group-hover:text-lime transition-colors block truncate">
                        {m.name}
                      </span>
                      <span className="text-[10px] text-mutedText block truncate">{m.role}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-lime shrink-0">Enter →</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-px bg-elevated-border flex-1" />
            <span className="text-[10px] font-mono uppercase text-mutedText">or standard sign in</span>
            <div className="h-px bg-elevated-border flex-1" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {mode === 'signup' && (
              <div>
                <label className="text-warmWhite font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="e.g. Maya Chen"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>
            )}

            <div>
              <label className="text-warmWhite font-semibold block mb-1">University / Student Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@university.edu"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-warmWhite font-semibold block mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-mutedText absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime transition-all flex items-center justify-center gap-1.5 mt-2"
            >
              <span>{mode === 'signin' ? 'Continue to FairShare' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="text-center text-xs text-mutedText pt-2 border-t border-elevated-border">
            {mode === 'signin' ? (
              <span>
                New to FairShare?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="text-lime hover:underline font-semibold"
                >
                  Create an account
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signin')}
                  className="text-lime hover:underline font-semibold"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-mutedText z-10 font-mono">
        FairShare — Every contribution counts.
      </div>
    </div>
  );
};

