import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Users, 
  Plus, 
  Sparkles, 
  ShieldCheck, 
  HeartHandshake, 
  Activity, 
  Smile, 
  Frown, 
  Meh, 
  Star, 
  MessageSquare, 
  Check, 
  Sliders,
  Mail,
  UserPlus
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const TeamPage: React.FC = () => {
  const { 
    members, 
    currentUser, 
    pulse, 
    peerFeedback, 
    submitPulse, 
    submitPeerReview, 
    inviteMember, 
    updateMemberCapacity,
    getFairnessAnalysis 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'members' | 'pulse' | 'feedback'>('members');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('');
  const [inviteSkills, setInviteSkills] = useState('');
  const [inviteCapacity, setInviteCapacity] = useState(10);

  // Pulse Form State
  const [pulseWorkload, setPulseWorkload] = useState<'manageable' | 'heavy' | 'overloaded'>('manageable');
  const [pulseBlocker, setPulseBlocker] = useState<'none' | 'clarification' | 'waiting_teammate' | 'technical'>('none');
  const [pulseFeedback, setPulseFeedback] = useState('');
  const [pulseSuccess, setPulseSuccess] = useState(false);

  // Peer Review Form State
  const [revieweeId, setRevieweeId] = useState(members.find(m => m.user_id !== currentUser.id)?.user_id || '');
  const [commScore, setCommScore] = useState(5);
  const [relScore, setRelScore] = useState(5);
  const [collabScore, setCollabScore] = useState(5);
  const [supportScore, setSupportScore] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const analysis = getFairnessAnalysis();

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) return;

    inviteMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole || 'Contributor',
      skills: inviteSkills.split(',').map(s => s.trim()).filter(Boolean),
      capacity_points: Number(inviteCapacity) || 10,
      availability_hours: 15,
    });

    setIsInviteModalOpen(false);
    setInviteName('');
    setInviteEmail('');
    setInviteRole('');
    setInviteSkills('');
  };

  const handlePulseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitPulse(pulseWorkload, pulseBlocker, pulseFeedback);
    setPulseSuccess(true);
    setTimeout(() => setPulseSuccess(false), 4000);
    confetti({ particleCount: 50, spread: 50, origin: { y: 0.7 } });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revieweeId) return;

    submitPeerReview(revieweeId, 'Milestone 2 Sprint Review', {
      communication: commScore,
      reliability: relScore,
      collaboration: collabScore,
      supportiveness: supportScore,
      comment: reviewComment,
    });

    setReviewSuccess(true);
    setReviewComment('');
    setTimeout(() => setReviewSuccess(false), 4000);
    confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
  };

  return (
    <div className="space-y-8">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Team Dynamics & Capacity
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Empower teammates through transparent capacity planning, weekly check-in pulses, and constructive peer praise.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-1.5"
          >
            <UserPlus className="w-4 h-4" /> Invite Teammate
          </button>
        </div>
      </div>

      {/* Navigation Pill Tabs */}
      <div className="flex items-center gap-2 bg-midnight p-1 rounded-2xl border border-elevated-border self-start w-fit">
        <button
          onClick={() => setActiveTab('members')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'members'
              ? 'bg-elevated text-lime shadow-sm'
              : 'text-mutedText hover:text-warmWhite'
          }`}
        >
          Teammates & Capacities ({members.length})
        </button>
        <button
          onClick={() => setActiveTab('pulse')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'pulse'
              ? 'bg-elevated text-lime shadow-sm'
              : 'text-mutedText hover:text-warmWhite'
          }`}
        >
          Weekly Pulse Check-In
        </button>
        <button
          onClick={() => setActiveTab('feedback')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'feedback'
              ? 'bg-elevated text-lime shadow-sm'
              : 'text-mutedText hover:text-warmWhite'
          }`}
        >
          Peer Feedback Rubric
        </button>
      </div>

      {/* TAB 1: MEMBERS & CAPACITY */}
      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {members.map(member => {
            const metric = analysis.member_metrics.find(m => m.user_id === member.user_id);
            const assigned = metric?.assigned_effort || 0;
            const completed = metric?.completed_effort || 0;
            const utilization = metric?.utilization_pct || 0;
            const isMe = member.user_id === currentUser.id;

            return (
              <div
                key={member.user_id}
                className="surface-elevated rounded-2xl p-5 border border-elevated-border space-y-4 hover:border-lime/30 transition-all relative overflow-hidden"
              >
                {isMe && (
                  <span className="absolute top-3 right-3 px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-lime/15 text-lime border border-lime/30">
                    You
                  </span>
                )}

                <div className="flex items-center gap-3">
                  <img
                    src={member.avatar_url}
                    alt={member.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-elevated-border"
                  />
                  <div className="truncate">
                    <h3 className="font-bold text-warmWhite text-sm font-display truncate">
                      {member.name}
                    </h3>
                    <p className="text-xs text-mutedText truncate">{member.role}</p>
                    <span className="text-[10px] text-mutedText/70 font-mono block">
                      {member.email}
                    </span>
                  </div>
                </div>

                {/* Capacity & Load Bar */}
                <div className="bg-midnight p-3.5 rounded-xl border border-elevated-border space-y-2">
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-mutedText">Current Load</span>
                    <span className="font-mono font-bold text-warmWhite">
                      {assigned} / {member.capacity_points} pts ({utilization}%)
                    </span>
                  </div>
                  <div className="w-full bg-elevated h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        utilization > 120
                          ? 'bg-coral'
                          : utilization < 50
                          ? 'bg-softBlue'
                          : 'bg-lime'
                      }`}
                      style={{ width: `${Math.min(100, utilization)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-mutedText font-mono pt-1">
                    <span>Delivered: {completed} pts</span>
                    <span className="capitalize">{metric?.load_status || 'optimal'}</span>
                  </div>
                </div>

                {/* Capacity Adjuster */}
                <div className="pt-2 border-t border-elevated-border flex items-center justify-between">
                  <span className="text-[11px] text-mutedText flex items-center gap-1">
                    <Sliders className="w-3 h-3" /> Sprint Target:
                  </span>
                  <div className="flex items-center gap-1.5">
                    {[8, 10, 12].map(pts => (
                      <button
                        key={pts}
                        onClick={() => updateMemberCapacity(member.user_id, pts)}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded ${
                          member.capacity_points === pts
                            ? 'bg-lime text-obsidian font-bold'
                            : 'bg-midnight text-mutedText hover:text-warmWhite border border-elevated-border'
                        }`}
                      >
                        {pts}p
                      </button>
                    ))}
                  </div>
                </div>

                {/* Skills Badges */}
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block mb-1.5">
                    Skills & Tooling
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {member.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 text-[10px] rounded bg-midnight border border-elevated-border text-warmWhite"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: TEAM PULSE */}
      {activeTab === 'pulse' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submit Weekly Pulse */}
          <div className="lg:col-span-5 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Activity className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold font-display text-warmWhite">
                  Your Weekly Check-in
                </h3>
              </div>
              <p className="text-xs text-mutedText">
                Check-ins are shared transparently with your project leads to unblock workloads early.
              </p>
            </div>

            {pulseSuccess && (
              <div className="p-3 bg-lime/15 border border-lime/30 rounded-xl text-xs text-lime font-medium flex items-center gap-2">
                <Check className="w-4 h-4" /> Pulse check-in recorded for this week!
              </div>
            )}

            <form onSubmit={handlePulseSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-warmWhite block mb-2">
                  1. How is your workload feeling right now?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['manageable', 'heavy', 'overloaded'] as const).map(status => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setPulseWorkload(status)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1 capitalize transition-all ${
                        pulseWorkload === status
                          ? status === 'overloaded'
                            ? 'bg-coral/20 border-coral text-coral font-bold'
                            : 'bg-lime/20 border-lime text-lime font-bold'
                          : 'bg-midnight border-elevated-border text-mutedText'
                      }`}
                    >
                      {status === 'manageable' ? <Smile className="w-4 h-4" /> : status === 'heavy' ? <Meh className="w-4 h-4" /> : <Frown className="w-4 h-4" />}
                      <span>{status}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-semibold text-warmWhite block mb-2">
                  2. Are you experiencing any blockers?
                </label>
                <select
                  value={pulseBlocker}
                  onChange={e => setPulseBlocker(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
                >
                  <option value="none">No blocker — cruising smoothly</option>
                  <option value="clarification">Need clarification on project scope</option>
                  <option value="waiting_teammate">Waiting on teammate dependency</option>
                  <option value="technical">Technical / infrastructure blocker</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-warmWhite block mb-1.5">
                  3. Notes or requests for team sync
                </label>
                <textarea
                  rows={3}
                  value={pulseFeedback}
                  onChange={e => setPulseFeedback(e.target.value)}
                  placeholder="Anything your team should know to help you succeed this week..."
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-lime text-obsidian font-bold text-xs rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Submit Pulse
              </button>
            </form>
          </div>

          {/* Team Check-in Stream */}
          <div className="lg:col-span-7 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-4">
            <h3 className="text-base font-bold font-display text-warmWhite">
              Team Pulse Feed
            </h3>
            <div className="space-y-3">
              {pulse.map(item => (
                <div
                  key={item.id}
                  className="p-4 bg-midnight rounded-xl border border-elevated-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-warmWhite">{item.user_name}</span>
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${
                      item.workload_status === 'overloaded'
                        ? 'bg-coral/20 text-coral'
                        : item.workload_status === 'heavy'
                        ? 'bg-amber-400/20 text-amber-400'
                        : 'bg-lime/20 text-lime'
                    }`}>
                      {item.workload_status}
                    </span>
                  </div>
                  <p className="text-mutedText leading-relaxed">"{item.feedback}"</p>
                  <div className="flex items-center justify-between text-[10px] text-mutedText/70 font-mono pt-1">
                    <span>Blocker status: {item.blocker_status}</span>
                    <span>{new Date(item.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PEER FEEDBACK RUBRIC */}
      {activeTab === 'feedback' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Submit Peer Praise / Review */}
          <div className="lg:col-span-5 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HeartHandshake className="w-4 h-4 text-lime" />
                <h3 className="text-base font-bold font-display text-warmWhite">
                  Structured Peer Feedback
                </h3>
              </div>
              <p className="text-xs text-mutedText leading-relaxed">
                Tied to project milestones. Peer reviews are private by default and promote psychological safety without toxic leaderboards.
              </p>
            </div>

            {reviewSuccess && (
              <div className="p-3 bg-lime/15 border border-lime/30 rounded-xl text-xs text-lime font-medium flex items-center gap-2">
                <Check className="w-4 h-4" /> Peer feedback submitted successfully!
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-warmWhite block mb-1.5">
                  Select Teammate to Review
                </label>
                <select
                  value={revieweeId}
                  onChange={e => setRevieweeId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
                >
                  {members
                    .filter(m => m.user_id !== currentUser.id)
                    .map(m => (
                      <option key={m.user_id} value={m.user_id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                </select>
              </div>

              {/* 4 Rubric Metrics */}
              <div className="space-y-3 bg-midnight p-3.5 rounded-xl border border-elevated-border">
                {[
                  { label: 'Communication Clarity', val: commScore, set: setCommScore },
                  { label: 'Reliability on Deliverables', val: relScore, set: setRelScore },
                  { label: 'Collaboration & Receptiveness', val: collabScore, set: setCollabScore },
                  { label: 'Team Supportiveness', val: supportScore, set: setSupportScore },
                ].map(r => (
                  <div key={r.label} className="flex items-center justify-between">
                    <span className="text-[11px] text-warmWhite">{r.label}</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => r.set(star)}
                          className={`p-1 transition-colors ${
                            star <= r.val ? 'text-lime' : 'text-mutedText/40'
                          }`}
                        >
                          <Star className="w-3.5 h-3.5 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="font-semibold text-warmWhite block mb-1.5">
                  Constructive Praise & Context
                </label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={e => setReviewComment(e.target.value)}
                  placeholder="Share what this teammate did exceptionally well during this sprint..."
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite text-xs focus:border-lime"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-lime text-obsidian font-bold text-xs rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" /> Submit Milestone Feedback
              </button>
            </form>
          </div>

          {/* Feedback Received Feed */}
          <div className="lg:col-span-7 surface-elevated rounded-2xl p-6 border border-elevated-border space-y-4">
            <h3 className="text-base font-bold font-display text-warmWhite">
              Milestone Feedback History
            </h3>
            <div className="space-y-3">
              {peerFeedback.map(fb => (
                <div
                  key={fb.id}
                  className="p-4 bg-midnight rounded-xl border border-elevated-border space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-warmWhite">{fb.reviewer_name}</span>{' '}
                      <span className="text-mutedText">reviewed</span>{' '}
                      <span className="text-lime font-bold">{fb.reviewee_name}</span>
                    </div>
                    <span className="text-[10px] text-mutedText font-mono">
                      {fb.milestone_name}
                    </span>
                  </div>

                  <p className="text-warmWhite/90 leading-relaxed italic">
                    "{fb.comment}"
                  </p>

                  <div className="grid grid-cols-4 gap-2 pt-2 border-t border-elevated-border/60 text-[10px] font-mono text-mutedText">
                    <div>Comm: {fb.communication}/5</div>
                    <div>Rel: {fb.reliability}/5</div>
                    <div>Collab: {fb.collaboration}/5</div>
                    <div>Support: {fb.supportiveness}/5</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Invite Member Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-elevated border border-elevated-border rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <h3 className="text-lg font-bold font-display text-warmWhite mb-1">
              Invite Teammate to FairShare
            </h3>
            <p className="text-xs text-mutedText mb-4">
              Add college teammates to establish capacity and assign deliverables.
            </p>

            <form onSubmit={handleInviteSubmit} className="space-y-4 text-xs">
              <div>
                <label className="text-warmWhite font-semibold block mb-1">Full Name</label>
                <input
                  type="text"
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="e.g. Priyanshu Roy"
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">Email (.edu or student)</label>
                <input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="priyanshu@university.edu"
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                  required
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">Role</label>
                <input
                  type="text"
                  value={inviteRole}
                  onChange={e => setInviteRole(e.target.value)}
                  placeholder="e.g. ML Researcher & Python Dev"
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">
                  Skills (comma separated)
                </label>
                <input
                  type="text"
                  value={inviteSkills}
                  onChange={e => setInviteSkills(e.target.value)}
                  placeholder="PyTorch, Data Analysis, SQL"
                  className="w-full px-3 py-2 rounded-xl bg-midnight border border-elevated-border text-warmWhite focus:border-lime"
                />
              </div>

              <div>
                <label className="text-warmWhite font-semibold block mb-1">
                  Target Effort Points / Sprint ({inviteCapacity}p)
                </label>
                <input
                  type="range"
                  min="5"
                  max="15"
                  value={inviteCapacity}
                  onChange={e => setInviteCapacity(Number(e.target.value))}
                  className="w-full accent-lime cursor-pointer"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-elevated-border">
                <button
                  type="button"
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-mutedText hover:text-warmWhite"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-lime text-obsidian font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime"
                >
                  Send Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

