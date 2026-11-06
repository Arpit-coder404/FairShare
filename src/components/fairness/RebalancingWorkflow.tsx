import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SuggestedRedistribution } from '../../types';
import { useAppStore } from '../../store/useAppStore';
import { ArrowRight, Check, Sparkles, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RebalancingWorkflowProps {
  suggestions: SuggestedRedistribution[];
}

export const RebalancingWorkflow: React.FC<RebalancingWorkflowProps> = ({ suggestions }) => {
  const { executeRedistribution } = useAppStore();
  const [selectedSuggestion, setSelectedSuggestion] = useState<SuggestedRedistribution | null>(
    suggestions[0] || null
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<SuggestedRedistribution | null>(null);

  if (!suggestions.length) {
    return (
      <div className="surface-elevated rounded-2xl p-6 border border-elevated-border flex flex-col items-center justify-center text-center py-10">
        <div className="w-12 h-12 rounded-full bg-lime/10 border border-lime/30 flex items-center justify-center text-lime mb-3">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <h4 className="text-base font-bold text-warmWhite font-display">Equilibrium Achieved</h4>
        <p className="text-xs text-mutedText max-w-md mt-1">
          No severe workload imbalances detected. All active team members are working within their safe capacity tolerances.
        </p>
      </div>
    );
  }

  const active = selectedSuggestion || suggestions[0];

  const handleApply = (sug: SuggestedRedistribution) => {
    const ok = executeRedistribution(sug.id);
    if (ok) {
      setLastExecuted(sug);
      setIsSuccessModalOpen(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#C9FF5C', '#8EAFFF', '#B8A0FF'],
      });
      // Pick next suggestion if available
      const remaining = suggestions.filter(s => s.id !== sug.id);
      setSelectedSuggestion(remaining[0] || null);
    }
  };

  return (
    <div className="surface-elevated rounded-2xl p-6 border border-elevated-border relative">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-lime/10 text-lime border border-lime/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-warmWhite font-display">
              Smart Redistribution Proposals
            </h3>
          </div>
          <p className="text-xs text-mutedText mt-0.5">
            Algorithmic recommendations to relieve overloaded teammates and restore team equilibrium.
          </p>
        </div>

        <span className="px-2.5 py-1 text-xs font-mono font-semibold rounded bg-midnight border border-elevated-border text-lime">
          {suggestions.length} Actionable Proposal{suggestions.length > 1 ? 's' : ''}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Suggestion list */}
        <div className="lg:col-span-5 space-y-2.5">
          {suggestions.map(s => {
            const isSelected = active?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedSuggestion(s)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? 'bg-midnight border-lime shadow-glow-lime/10 ring-1 ring-lime/30'
                    : 'bg-midnight/60 border-elevated-border hover:border-mutedText/40'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate">
                    <span className="text-xs font-semibold text-warmWhite block truncate">
                      {s.task_title}
                    </span>
                    <span className="text-[11px] text-mutedText mt-0.5 block">
                      {s.from_user_name} <span className="text-coral">({s.before_from_effort}p)</span> → {s.to_user_name} <span className="text-softBlue">({s.before_to_effort}p)</span>
                    </span>
                  </div>
                  <span className="px-2 py-0.5 text-xs font-mono font-bold rounded bg-elevated text-lime shrink-0">
                    +{s.task_effort}p
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Before and After Preview Card */}
        {active && (
          <div className="lg:col-span-7 bg-midnight rounded-xl p-5 border border-elevated-border flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-elevated-border">
                <span className="text-xs font-mono uppercase tracking-wider text-mutedText">
                  Simulation Preview
                </span>
                <span className="text-xs font-mono text-lime flex items-center gap-1 font-semibold">
                  <Zap className="w-3.5 h-3.5" /> High Confidence Match
                </span>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-bold text-warmWhite font-display">
                  {active.task_title}
                </h4>
                <p className="text-xs text-mutedText mt-1.5 leading-relaxed bg-elevated/50 p-2.5 rounded-lg border border-elevated-border">
                  💡 <strong className="text-warmWhite font-medium">Algorithmic Rationale:</strong> {active.reason}
                </p>
              </div>

              {/* Before and After comparison meters */}
              <div className="mt-5 space-y-4">
                {/* From user */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-warmWhite font-medium">
                      {active.from_user_name} (Current Owner)
                    </span>
                    <span className="font-mono text-xs">
                      <span className="text-coral font-bold">{active.before_from_effort} pts</span>
                      <ArrowRight className="inline w-3 h-3 mx-1 text-mutedText" />
                      <span className="text-lime font-bold">{active.after_from_effort} pts</span>
                    </span>
                  </div>
                  <div className="w-full bg-elevated h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-coral h-full transition-all"
                      style={{ width: `${Math.min(100, (active.after_from_effort / 10) * 100)}%` }}
                    />
                    <div
                      className="bg-coral/30 h-full transition-all"
                      style={{ width: `${Math.min(100, (active.task_effort / 10) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-mutedText mt-0.5 block">
                    Relieves {active.task_effort} effort points ({active.before_from_effort * 10}% → {active.after_from_effort * 10}% capacity)
                  </span>
                </div>

                {/* To user */}
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-warmWhite font-medium">
                      {active.to_user_name} (Recommended Recipient)
                    </span>
                    <span className="font-mono text-xs">
                      <span className="text-softBlue font-bold">{active.before_to_effort} pts</span>
                      <ArrowRight className="inline w-3 h-3 mx-1 text-mutedText" />
                      <span className="text-lime font-bold">{active.after_to_effort} pts</span>
                    </span>
                  </div>
                  <div className="w-full bg-elevated h-2 rounded-full overflow-hidden flex">
                    <div
                      className="bg-softBlue h-full transition-all"
                      style={{ width: `${Math.min(100, (active.before_to_effort / 10) * 100)}%` }}
                    />
                    <div
                      className="bg-lime h-full transition-all"
                      style={{ width: `${Math.min(100, (active.task_effort / 10) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-mutedText mt-0.5 block">
                    Absorbs {active.task_effort} effort points without exceeding safe threshold
                  </span>
                </div>
              </div>
            </div>

            {/* Execute Button */}
            <div className="mt-6 pt-4 border-t border-elevated-border flex items-center justify-between gap-3">
              <span className="text-[11px] text-mutedText">
                Updates task assignee & broadcasts event to team.
              </span>
              <button
                onClick={() => handleApply(active)}
                className="px-4 py-2 bg-lime text-obsidian font-bold text-xs rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-1.5 shrink-0"
              >
                <Check className="w-4 h-4" /> Execute Rebalance
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Rebalance Toast Confirmation Modal */}
      <AnimatePresence>
        {isSuccessModalOpen && lastExecuted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 bg-obsidian/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <div className="bg-elevated border border-lime/40 rounded-2xl p-6 max-w-md w-full shadow-2xl relative text-center">
              <div className="w-14 h-14 rounded-full bg-lime/10 border border-lime/30 text-lime flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold font-display text-warmWhite">
                Workload Successfully Rebalanced
              </h3>
              <p className="text-xs text-mutedText mt-2 leading-relaxed">
                Task <strong className="text-warmWhite font-semibold">"{lastExecuted.task_title}"</strong> has been transferred from <strong className="text-coral">{lastExecuted.from_user_name}</strong> to <strong className="text-softBlue">{lastExecuted.to_user_name}</strong>.
              </p>

              <div className="my-5 p-3.5 bg-midnight rounded-xl border border-elevated-border text-xs flex justify-around">
                <div>
                  <span className="text-[10px] text-mutedText block">Imbalance Relieved</span>
                  <span className="font-mono text-sm font-bold text-lime">-{lastExecuted.task_effort} pts</span>
                </div>
                <div className="w-px bg-elevated-border" />
                <div>
                  <span className="text-[10px] text-mutedText block">Fairness Index</span>
                  <span className="font-mono text-sm font-bold text-lime">+18% gain</span>
                </div>
              </div>

              <button
                onClick={() => setIsSuccessModalOpen(false)}
                className="w-full py-2.5 bg-lime text-obsidian font-bold text-xs rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

