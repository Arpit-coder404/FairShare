import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Scale, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Users, 
  Layers, 
  Clock, 
  Activity, 
  BarChart3, 
  Zap, 
  Compass, 
  Menu, 
  X,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { DEMO_MEMBERS } from '../../data/demoData';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [engineShowcaseMode, setEngineShowcaseMode] = useState<'assigned' | 'completed' | 'capacity' | 'balance'>('balance');

  return (
    <div className="min-h-screen bg-obsidian text-warmWhite overflow-x-hidden">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-40 bg-obsidian/80 backdrop-blur-xl border-b border-elevated-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-lime/15 border border-lime/30 flex items-center justify-center text-lime group-hover:scale-105 transition-transform shadow-glow-lime/20">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl font-display tracking-tight text-warmWhite flex items-center gap-1.5">
                FairShare
                <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              </span>
              <span className="text-[10px] text-mutedText font-mono tracking-wider block">
                TEAMWORK REBALANCED
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-mutedText">
            <a href="#how-it-works" className="hover:text-warmWhite transition-colors">How it works</a>
            <a href="#engine" className="hover:text-warmWhite transition-colors">Fairness Engine</a>
            <a href="#features" className="hover:text-warmWhite transition-colors">Features</a>
            <a href="#philosophy" className="hover:text-warmWhite transition-colors">Philosophy</a>
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => navigate('/auth')}
              className="px-4 py-2 text-xs font-semibold text-mutedText hover:text-warmWhite transition-colors"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-5 py-2.5 bg-lime text-obsidian text-xs font-extrabold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-1.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden p-2 text-mutedText hover:text-warmWhite"
          >
            {mobileNavOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileNavOpen && (
          <div className="md:hidden bg-midnight border-b border-elevated-border px-6 py-6 space-y-4">
            <a href="#how-it-works" onClick={() => setMobileNavOpen(false)} className="block text-sm text-warmWhite">How it works</a>
            <a href="#engine" onClick={() => setMobileNavOpen(false)} className="block text-sm text-warmWhite">Fairness Engine</a>
            <a href="#features" onClick={() => setMobileNavOpen(false)} className="block text-sm text-warmWhite">Features</a>
            <div className="pt-4 border-t border-elevated-border flex flex-col gap-2">
              <button
                onClick={() => navigate('/auth')}
                className="w-full py-2.5 bg-elevated rounded-xl text-xs font-bold text-warmWhite"
              >
                Sign in
              </button>
              <button
                onClick={() => navigate('/app')}
                className="w-full py-2.5 bg-lime text-obsidian rounded-xl text-xs font-bold shadow-glow-lime"
              >
                Launch Workspace
              </button>
            </div>
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 px-6 max-w-7xl mx-auto">
        {/* Glow ambient background elements */}
        <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-lime/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-softBlue/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Hero Editorial Column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/25 text-lime text-[11px] font-mono font-bold tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>COLLABORATION, REBALANCED</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold font-display text-warmWhite tracking-tight leading-[1.08]">
              Teamwork shouldn't feel like a <span className="text-lime underline decoration-lime/40 decoration-4 underline-offset-8">solo project</span>.
            </h1>

            <p className="text-sm sm:text-base text-mutedText max-w-xl leading-relaxed">
              FairShare brings empirical clarity to group work—so every teammate knows what matters, what they own, and whether the load is actually fair.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/onboarding')}
                className="px-6 py-3.5 bg-lime text-obsidian font-extrabold text-sm rounded-2xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center justify-center gap-2"
              >
                <span>Build your team</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/app/projects/proj-nebula-main/fairness')}
                className="px-6 py-3.5 bg-midnight hover:bg-elevated border border-elevated-border text-warmWhite font-semibold text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <Scale className="w-4 h-4 text-lime" />
                <span>Explore the Fairness Engine</span>
              </button>
            </div>

            <div className="pt-6 flex items-center gap-6 text-xs text-mutedText font-mono">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime" />
                <span>Zero Surveillance</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime" />
                <span>Transparent Math</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime" />
                <span>Demo Workspace Ready</span>
              </div>
            </div>
          </div>

          {/* Right Hero: Immersive Product Preview */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Product Frame Mockup */}
              <div className="surface-elevated rounded-3xl p-5 border border-elevated-border shadow-2xl relative overflow-hidden backdrop-blur-xl">
                {/* Header bar of fake window */}
                <div className="flex items-center justify-between pb-4 border-b border-elevated-border/80">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-coral/60" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <span className="w-3 h-3 rounded-full bg-lime/60" />
                    <span className="text-xs font-mono text-mutedText ml-2">Project Nebula • Live Engine</span>
                  </div>

                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-midnight border border-elevated-border text-lime font-bold">
                    Balance Score: 68/100
                  </span>
                </div>

                {/* Body mockup */}
                <div className="py-4 space-y-4">
                  {/* Floating Fairness Insight Pill */}
                  <div className="p-3 bg-coral/15 border border-coral/30 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <AlertCircle className="w-4 h-4 text-coral shrink-0" />
                      <span className="text-coral font-medium">
                        Maya has 15 effort pts assigned (150% capacity). Team average is 7.5 pts.
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-coral text-obsidian text-[10px] font-bold uppercase shrink-0">
                      Overload
                    </span>
                  </div>

                  {/* 5 Contributor Nodes strip */}
                  <div className="grid grid-cols-5 gap-2">
                    {DEMO_MEMBERS.map(m => (
                      <div
                        key={m.user_id}
                        className="p-2.5 bg-midnight rounded-xl border border-elevated-border text-center space-y-1.5"
                      >
                        <img
                          src={m.avatar_url}
                          alt={m.name}
                          className="w-8 h-8 rounded-full object-cover mx-auto border"
                          style={{
                            borderColor: m.name.includes('Maya') ? '#FF786E' : '#C9FF5C',
                          }}
                        />
                        <span className="text-[11px] font-bold text-warmWhite block truncate">
                          {m.name.split(' ')[0]}
                        </span>
                        <span className="text-[9px] font-mono text-mutedText block">
                          {m.name.includes('Maya') ? '15p' : m.name.includes('Arjun') ? '8p' : '4p'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Task Card Sample */}
                  <div className="p-3.5 bg-midnight rounded-2xl border border-elevated-border flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-lime" />
                      <div>
                        <span className="text-warmWhite font-bold block">
                          Realtime WebSocket Peer Sync
                        </span>
                        <span className="text-[10px] text-coral font-medium flex items-center gap-1 mt-0.5">
                          <ShieldAlert className="w-3 h-3" /> Blocked on auth rotation
                        </span>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded bg-elevated font-mono text-[10px] text-lime font-bold">
                      4 Effort Points
                    </span>
                  </div>
                </div>

                {/* Bottom preview banner */}
                <div className="pt-3 border-t border-elevated-border/80 flex items-center justify-between text-[11px] text-mutedText font-mono">
                  <span>Equilibrium Analysis Active</span>
                  <span className="text-lime font-semibold">1-Click Rebalance Available →</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* EDITORIAL SECTION: THE UNFAIR REALITY */}
      <section className="py-24 border-y border-elevated-border bg-midnight/50 relative">
        <div className="max-w-5xl mx-auto px-6 text-center space-y-8">
          <span className="text-xs font-mono uppercase tracking-widest text-coral font-bold block">
            THE UNFAIR REALITY OF COLLEGE GROUP PROJECTS
          </span>

          <div className="space-y-4">
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-warmWhite tracking-tight">
              "One person writes the report."
            </h2>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-mutedText/80 tracking-tight">
              "One person fixes everything at 3 AM."
            </h2>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-warmWhite/60 tracking-tight">
              "Everyone gets the same grade."
            </h2>
          </div>

          <p className="text-sm sm:text-base text-mutedText max-w-2xl mx-auto leading-relaxed pt-4">
            Traditional task managers track items on a checklist. They can't see when one student is doing 70% of the heavy lifting until resentment breaks the team. FairShare makes effort visible on day one—giving teams the data to rebalance before deadlines collide.
          </p>
        </div>
      </section>

      {/* THE FAIRNESS ENGINE INTERACTIVE SHOWCASE */}
      <section id="engine" className="py-24 max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-lime/10 border border-lime/20 text-lime text-xs font-mono font-bold uppercase">
            <Scale className="w-3.5 h-3.5" />
            <span>Interactive Showcase</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-warmWhite">
            The Fairness Engine in Motion
          </h2>
          <p className="text-xs sm:text-sm text-mutedText">
            Toggle between core dimensions to inspect how the engine evaluates collaboration balance.
          </p>
        </div>

        {/* Dimension Switcher Controls */}
        <div className="flex justify-center">
          <div className="bg-midnight p-1.5 rounded-2xl border border-elevated-border flex flex-wrap gap-1">
            {[
              { id: 'balance', label: 'Workload Balance' },
              { id: 'assigned', label: 'Assigned Effort' },
              { id: 'completed', label: 'Completed Deliverables' },
              { id: 'capacity', label: 'Target Capacity' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setEngineShowcaseMode(tab.id as any)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                  engineShowcaseMode === tab.id
                    ? 'bg-elevated text-lime shadow-glow-lime/10 border border-lime/30'
                    : 'text-mutedText hover:text-warmWhite'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Display Panel */}
        <div className="surface-elevated rounded-3xl p-6 sm:p-10 border border-elevated-border max-w-4xl mx-auto">
          {engineShowcaseMode === 'balance' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-elevated-border">
                <div>
                  <h3 className="text-lg font-bold font-display text-warmWhite">
                    Workload Balance Score: 68 / 100
                  </h3>
                  <p className="text-xs text-mutedText mt-1">
                    Status: <span className="text-amber-400 font-bold uppercase">Moderate Imbalance</span> • 1 teammate carrying disproportionate workload.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/app/projects/proj-nebula-main/fairness')}
                  className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim shadow-glow-lime"
                >
                  Inspect in Workspace
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {DEMO_MEMBERS.map(m => {
                  const pts = m.name.includes('Maya') ? 15 : m.name.includes('Arjun') ? 8 : m.name.includes('Zoya') ? 10 : 4;
                  const isOver = pts > 10;
                  return (
                    <div key={m.user_id} className="p-3 bg-midnight rounded-xl border border-elevated-border text-center space-y-1">
                      <img src={m.avatar_url} alt={m.name} className="w-10 h-10 rounded-full object-cover mx-auto border border-elevated-border" />
                      <span className="text-xs font-bold text-warmWhite block">{m.name.split(' ')[0]}</span>
                      <span className={`text-xs font-mono font-bold ${isOver ? 'text-coral' : 'text-lime'}`}>{pts} pts</span>
                      <span className="text-[10px] text-mutedText block">{isOver ? 'Overloaded' : 'Optimal'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {engineShowcaseMode === 'assigned' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-warmWhite">Assigned Effort Breakdown</h3>
              <p className="text-xs text-mutedText">
                Calculated strictly using weighted difficulty points (1 - 10), never raw task count.
              </p>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs text-warmWhite"><span>Maya Chen (UI/UX)</span><span className="font-mono text-coral font-bold">15 Effort Points</span></div>
                <div className="w-full bg-midnight h-2 rounded-full overflow-hidden"><div className="bg-coral h-full w-[100%]" /></div>

                <div className="flex justify-between text-xs text-warmWhite pt-2"><span>Zoya Patel (Backend)</span><span className="font-mono text-lime font-bold">10 Effort Points</span></div>
                <div className="w-full bg-midnight h-2 rounded-full overflow-hidden"><div className="bg-lime h-full w-[66%]" /></div>

                <div className="flex justify-between text-xs text-warmWhite pt-2"><span>Arjun Mehta (Frontend)</span><span className="font-mono text-lime font-bold">8 Effort Points</span></div>
                <div className="w-full bg-midnight h-2 rounded-full overflow-hidden"><div className="bg-lime h-full w-[53%]" /></div>
              </div>
            </div>
          )}

          {engineShowcaseMode === 'completed' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-warmWhite">Verified Deliverable Completions</h3>
              <p className="text-xs text-mutedText">
                Effort is credited only when tangible deliverables (code commit, design token JSON, academic paper) are submitted and verified.
              </p>
              <div className="p-4 bg-midnight rounded-2xl border border-elevated-border text-xs flex justify-around text-center">
                <div><span className="text-mutedText block text-[10px]">Total Effort Delivered</span><span className="text-xl font-bold font-mono text-lime">15 pts</span></div>
                <div><span className="text-mutedText block text-[10px]">Artifacts Uploaded</span><span className="text-xl font-bold font-mono text-warmWhite">3 files</span></div>
                <div><span className="text-mutedText block text-[10px]">Verified Milestones</span><span className="text-xl font-bold font-mono text-softBlue">Milestone 1 (100%)</span></div>
              </div>
            </div>
          )}

          {engineShowcaseMode === 'capacity' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold font-display text-warmWhite">Safe Capacity Tolerances</h3>
              <p className="text-xs text-mutedText">
                Students report their real bandwidth based on coursework and exam schedules, protecting them from involuntary overload.
              </p>
              <div className="p-4 bg-midnight rounded-2xl border border-elevated-border text-xs text-mutedText leading-relaxed">
                "Maya Chen has set target capacity to 10 points (15 hours/week). Current assignment of 15 points triggers proactive redistribution suggestions before midterms."
              </div>
            </div>
          )}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how-it-works" className="py-24 border-t border-elevated-border bg-midnight/30">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">THE WORKFLOW</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-warmWhite">
              How FairShare Keeps Teams Whole
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Create Your Project',
                desc: 'Set up your capstone or hackathon project and invite teammates with their self-reported sprint capacity.',
              },
              {
                step: '02',
                title: 'Make Work Visible',
                desc: 'Break deliverables into effort-weighted tasks from 1 to 10 points. No generic checklists.',
              },
              {
                step: '03',
                title: 'Find the Imbalance',
                desc: 'The Fairness Engine continuously audits loads, detecting overloaded members and blocked dependencies.',
              },
              {
                step: '04',
                title: 'Rebalance Together',
                desc: 'Apply 1-click suggested redistributions matching task requirements to available teammate bandwidth.',
              },
            ].map(item => (
              <div
                key={item.step}
                className="surface-elevated rounded-2xl p-6 border border-elevated-border space-y-3 relative overflow-hidden"
              >
                <span className="text-3xl font-extrabold font-mono text-lime/40 block">
                  {item.step}
                </span>
                <h3 className="text-base font-bold font-display text-warmWhite">
                  {item.title}
                </h3>
                <p className="text-xs text-mutedText leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT FEATURES SHOWCASE */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-6 space-y-16">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-lime font-bold">CAPABILITIES</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-warmWhite">
            Designed for Academic Precision
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="surface-elevated rounded-3xl p-6 border border-elevated-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-lime/10 border border-lime/30 flex items-center justify-center text-lime">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-warmWhite">The Balance Orbit</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Realtime orbital visualization where node size represents assigned effort points and color pulses detect overburden early.
            </p>
          </div>

          <div className="surface-elevated rounded-3xl p-6 border border-elevated-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-softBlue/10 border border-softBlue/30 flex items-center justify-center text-softBlue">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-warmWhite">Smart Task Distribution</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Suggests best-fit assignees based on matching skills and unused sprint bandwidth. Users always retain full manual control.
            </p>
          </div>

          <div className="surface-elevated rounded-3xl p-6 border border-elevated-border space-y-3">
            <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/30 flex items-center justify-center text-violet">
              <Activity className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold font-display text-warmWhite">Weekly Team Pulse</h3>
            <p className="text-xs text-mutedText leading-relaxed">
              Low-friction weekly check-in surfacing hidden blockers and self-reported capacity shifts before milestones are jeopardized.
            </p>
          </div>
        </div>
      </section>

      {/* FINAL CTA SECTION */}
      <section className="py-24 border-t border-elevated-border bg-gradient-to-b from-midnight/40 to-obsidian relative">
        <div className="max-w-4xl mx-auto px-6 text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-warmWhite tracking-tight">
            Make your next group project different.
          </h2>
          <p className="text-sm sm:text-base text-mutedText max-w-xl mx-auto leading-relaxed">
            Eliminate free-riders, protect overloaded teammates, and produce verifiable contribution dossiers for your professors.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => navigate('/onboarding')}
              className="px-8 py-4 bg-lime text-obsidian text-sm font-extrabold rounded-2xl hover:bg-lime-dim shadow-glow-lime flex items-center gap-2"
            >
              <span>Start with your team</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/app')}
              className="px-8 py-4 bg-midnight hover:bg-elevated border border-elevated-border text-warmWhite text-sm font-semibold rounded-2xl"
            >
              Enter Demo Mode
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-elevated-border py-12 px-6 bg-obsidian text-xs text-mutedText">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-lime/15 border border-lime/30 flex items-center justify-center text-lime">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-bold text-warmWhite font-display">FairShare</span>
            <span className="text-mutedText/60">• Every contribution counts.</span>
          </div>

          <div className="flex items-center gap-6 font-mono text-[11px]">
            <span>Product</span>
            <span>About</span>
            <span>Community</span>
            <span>Privacy</span>
            <span>Contact</span>
            <span>GitHub</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

