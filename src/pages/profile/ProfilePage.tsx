import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { User, Mail, Shield, Check, Sliders, Sparkles, BookOpen } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { currentUser, members, switchUser } = useAppStore();
  const [bio, setBio] = useState(currentUser.bio || '');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold font-display text-warmWhite">
          Contributor Profile
        </h1>
        <p className="text-xs text-mutedText mt-1">
          Manage your student identity, registered competencies, and weekly capacity commitments.
        </p>
      </div>

      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border space-y-6">
        {/* User Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 pb-6 border-b border-elevated-border">
          <img
            src={currentUser.avatar_url}
            alt={currentUser.full_name}
            className="w-20 h-20 rounded-full object-cover border-2 border-lime shadow-glow-lime/20"
          />
          <div className="space-y-1">
            <h2 className="text-xl font-bold font-display text-warmWhite">
              {currentUser.full_name}
            </h2>
            <p className="text-xs text-lime font-medium">{currentUser.role}</p>
            <p className="text-xs text-mutedText font-mono flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> {currentUser.email}
            </p>
          </div>
        </div>

        {/* Quick Demo Switcher Strip */}
        <div className="p-4 bg-midnight rounded-2xl border border-elevated-border">
          <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block mb-2">
            Switch Demo Member Identity
          </span>
          <div className="flex flex-wrap gap-2">
            {members.map(m => (
              <button
                key={m.user_id}
                onClick={() => switchUser(m.user_id)}
                className={`px-3 py-1.5 rounded-xl text-xs flex items-center gap-2 transition-all ${
                  m.user_id === currentUser.id
                    ? 'bg-lime text-obsidian font-bold shadow-glow-lime/10'
                    : 'bg-elevated hover:bg-elevated-hover text-warmWhite border border-elevated-border'
                }`}
              >
                <img src={m.avatar_url} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                <span>{m.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Profile Details Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-warmWhite block mb-1">
              Bio & Focus Area
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="font-semibold text-warmWhite block mb-1">
                Target Capacity (Effort Points / Sprint)
              </label>
              <input
                type="number"
                value={currentUser.capacity_points}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs opacity-80"
              />
              <span className="text-[10px] text-mutedText mt-1 block">
                Target workload for safe equilibrium without burnout.
              </span>
            </div>

            <div>
              <label className="font-semibold text-warmWhite block mb-1">
                Weekly Availability
              </label>
              <input
                type="text"
                value={`${currentUser.availability_hours || 15} hours / week`}
                readOnly
                className="w-full px-3.5 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs opacity-80"
              />
              <span className="text-[10px] text-mutedText mt-1 block">
                Estimated bandwidth for synchronous meetings and work blocks.
              </span>
            </div>
          </div>

          <div>
            <label className="font-semibold text-warmWhite block mb-1.5">
              Verified Technical Skills
            </label>
            <div className="flex flex-wrap gap-1.5">
              {currentUser.skills.map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 text-xs rounded-lg bg-midnight border border-elevated-border text-warmWhite"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-elevated-border flex items-center justify-between">
            {isSaved ? (
              <span className="text-xs text-lime font-medium flex items-center gap-1">
                <Check className="w-4 h-4" /> Profile updated in local storage!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime transition-all"
            >
              Save Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

