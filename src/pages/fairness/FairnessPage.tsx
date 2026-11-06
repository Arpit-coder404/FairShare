import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { BalanceOrbit } from '../../components/fairness/BalanceOrbit';
import { RebalancingWorkflow } from '../../components/fairness/RebalancingWorkflow';
import { MemberMetric, FairnessInsight } from '../../types';
import { 
  Scale, 
  Sparkles, 
  AlertCircle, 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  TrendingUp, 
  ShieldCheck, 
  BarChart2, 
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Legend, 
  ReferenceLine 
} from 'recharts';

export const FairnessPage: React.FC = () => {
  const { 
    tasks, 
    members, 
    activeProjectId, 
    getFairnessAnalysis, 
    projects 
  } = useAppStore();

  const [selectedMember, setSelectedMember] = useState<MemberMetric | null>(null);
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [showFairnessPhilosophy, setShowFairnessPhilosophy] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeTasks = tasks.filter(t => t.project_id === activeProjectId);
  const analysis = getFairnessAnalysis();

  const visibleInsights = analysis.insights.filter(i => !dismissedInsights.includes(i.id));

  // Data for Workload vs Capacity Recharts
  const chartData = analysis.member_metrics.map(m => ({
    name: m.name.split(' ')[0],
    assigned: m.assigned_effort,
    completed: m.completed_effort,
    capacity: m.capacity_points,
    remaining: m.remaining_effort,
    utilization: m.utilization_pct,
  }));

  const handleDismissInsight = (id: string) => {
    setDismissedInsights([...dismissedInsights, id]);
  };

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border relative overflow-hidden">
        {/* Subtle ambient gradient */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-lime/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 text-[11px] font-mono uppercase tracking-wider rounded-lg bg-lime/10 text-lime border border-lime/20 flex items-center gap-1.5 font-bold">
                <Scale className="w-3.5 h-3.5" />
                The Fairness Engine
              </span>
              <button
                onClick={() => setShowFairnessPhilosophy(!showFairnessPhilosophy)}
                className="text-xs text-mutedText hover:text-warmWhite flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5" /> Core Philosophy
              </button>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-warmWhite tracking-tight">
              Is your team carrying its weight?
            </h1>
            <p className="text-xs sm:text-sm text-mutedText mt-2 leading-relaxed">
              Understand workload, contribution, and capacity—without turning teamwork into an unhealthy competition.
            </p>
          </div>

          {/* Quick Score Card */}
          <div className="flex items-center gap-4 bg-midnight/90 p-4 rounded-2xl border border-elevated-border self-start lg:self-auto shrink-0 shadow-lg">
            <div className="text-right">
              <span className="text-[10px] font-mono uppercase tracking-wider text-mutedText block">
                Workload Balance Score
              </span>
              <div className="flex items-baseline justify-end gap-1 mt-0.5">
                <span className="text-3xl font-extrabold font-mono text-warmWhite">
                  {analysis.balance_score}
                </span>
                <span className="text-xs font-mono text-mutedText">/ 100</span>
              </div>
              <span
                className={`inline-block px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider mt-1 ${
                  analysis.balance_score >= 80
                    ? 'bg-lime/20 text-lime'
                    : analysis.balance_score >= 60
                    ? 'bg-amber-400/20 text-amber-400'
                    : 'bg-coral/20 text-coral'
                }`}
              >
                {analysis.balance_status}
              </span>
            </div>

            <div className="w-16 h-16 rounded-2xl bg-elevated border border-elevated-border flex items-center justify-center shrink-0">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    analysis.balance_score >= 80
                      ? 'rgba(201, 255, 92, 0.15)'
                      : analysis.balance_score >= 60
                      ? 'rgba(255, 184, 110, 0.15)'
                      : 'rgba(255, 120, 110, 0.15)',
                  color:
                    analysis.balance_score >= 80
                      ? '#C9FF5C'
                      : analysis.balance_score >= 60
                      ? '#FFB86E'
                      : '#FF786E',
                }}
              >
                <Scale className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy Callout Banner */}
        {showFairnessPhilosophy && (
          <div className="mt-6 p-4 rounded-2xl bg-midnight border border-elevated-border text-xs text-mutedText leading-relaxed space-y-2">
            <h4 className="font-bold text-warmWhite font-display text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-lime" /> The FairShare Ethical Principle
            </h4>
            <p>
              FairShare never assumes that more tasks mean more contribution, fewer tasks mean less effort, or that a numerical score determines anyone’s worth. Metrics are estimates derived from task effort weighting and student-reported capacity, serving to surface unseen overburden early.
            </p>
          </div>
        )}

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-elevated-border">
          <div className="p-3.5 bg-midnight/70 rounded-xl border border-elevated-border">
            <span className="text-[10px] font-mono text-mutedText uppercase tracking-wider block">
              Total Project Effort
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-warmWhite">
                {analysis.total_effort}
              </span>
              <span className="text-xs text-mutedText font-mono">pts</span>
            </div>
            <span className="text-[10px] text-mutedText mt-1 block">
              Avg {analysis.average_effort_per_member} pts per member
            </span>
          </div>

          <div className="p-3.5 bg-midnight/70 rounded-xl border border-elevated-border">
            <span className="text-[10px] font-mono text-mutedText uppercase tracking-wider block">
              Effort Delivered
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-lime">
                {analysis.completed_effort}
              </span>
              <span className="text-xs text-mutedText font-mono">pts ({analysis.completion_rate}%)</span>
            </div>
            <div className="w-full bg-elevated h-1 rounded-full mt-2 overflow-hidden">
              <div className="bg-lime h-full rounded-full" style={{ width: `${analysis.completion_rate}%` }} />
            </div>
          </div>

          <div className="p-3.5 bg-midnight/70 rounded-xl border border-elevated-border">
            <span className="text-[10px] font-mono text-mutedText uppercase tracking-wider block">
              Overload Alerts
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-coral">
                {analysis.member_metrics.filter(m => m.load_status === 'overloaded').length}
              </span>
              <span className="text-xs text-mutedText">teammates overloaded</span>
            </div>
            <span className="text-[10px] text-coral/80 mt-1 block">
              Assigned load exceeds capacity
            </span>
          </div>

          <div className="p-3.5 bg-midnight/70 rounded-xl border border-elevated-border">
            <span className="text-[10px] font-mono text-mutedText uppercase tracking-wider block">
              Active Bottlenecks
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-bold font-mono text-amber-400">
                {analysis.bottlenecks.length}
              </span>
              <span className="text-xs text-mutedText">critical dependencies</span>
            </div>
            <span className="text-[10px] text-mutedText mt-1 block">
              Blocked or urgent critical path
            </span>
          </div>
        </div>
      </div>

      {/* Signature Visual: THE BALANCE ORBIT */}
      <BalanceOrbit
        metrics={analysis.member_metrics}
        tasks={activeTasks}
        onSelectMember={m => setSelectedMember(m)}
        selectedMemberId={selectedMember?.user_id}
      />

      {/* Workload Distribution Analytics Chart */}
      <div className="surface-elevated rounded-2xl p-6 border border-elevated-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-base font-bold font-display text-warmWhite">
              Workload vs. Capacity Comparison
            </h3>
            <p className="text-xs text-mutedText mt-0.5">
              Assigned effort points compared with weekly target capacity per teammate.
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-lime" />
              <span className="text-mutedText">Assigned</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded bg-violet" />
              <span className="text-mutedText">Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded border border-mutedText bg-transparent" />
              <span className="text-mutedText">Capacity Line</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" stroke="#9296A2" fontSize={11} tickLine={false} />
              <YAxis stroke="#9296A2" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#17191F',
                  borderColor: '#2E333E',
                  borderRadius: '12px',
                  fontSize: '11px',
                  color: '#F4F3EE',
                }}
              />
              <ReferenceLine y={10} stroke="#FF786E" strokeDasharray="3 3" label={{ value: 'Safe Capacity (10p)', fill: '#FF786E', fontSize: 10, position: 'insideTopRight' }} />
              <Bar dataKey="assigned" fill="#C9FF5C" radius={[4, 4, 0, 0]} name="Assigned Effort" />
              <Bar dataKey="completed" fill="#B8A0FF" radius={[4, 4, 0, 0]} name="Completed Effort" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Suggested Redistribution Workflow */}
      <RebalancingWorkflow suggestions={analysis.suggested_redistributions} />

      {/* Explainable Insights Feed */}
      <div className="surface-elevated rounded-2xl p-6 border border-elevated-border">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold font-display text-warmWhite">
              Explainable Fairness Insights
            </h3>
            <p className="text-xs text-mutedText mt-0.5">
              Real application state diagnostics with direct actionable remedies.
            </p>
          </div>
          <span className="px-2.5 py-1 text-xs font-mono rounded bg-midnight border border-elevated-border text-mutedText">
            {visibleInsights.length} Active Insight{visibleInsights.length > 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3">
          {visibleInsights.map(insight => {
            const isCritical = insight.severity === 'critical';
            const isWarning = insight.severity === 'warning';
            const isSuccess = insight.severity === 'success';

            return (
              <div
                key={insight.id}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-coral/10 border-coral/30'
                    : isWarning
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : isSuccess
                    ? 'bg-lime/10 border-lime/30'
                    : 'bg-midnight border-elevated-border'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className="p-1.5 rounded-lg shrink-0 mt-0.5" style={{
                      background: isCritical ? 'rgba(255, 120, 110, 0.2)' : isWarning ? 'rgba(255, 184, 110, 0.2)' : 'rgba(201, 255, 92, 0.2)',
                      color: isCritical ? '#FF786E' : isWarning ? '#FFB86E' : '#C9FF5C',
                    }}>
                      {isCritical ? <AlertCircle className="w-4 h-4" /> : isWarning ? <AlertTriangle className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    </span>

                    <div>
                      <h4 className="text-xs font-bold text-warmWhite font-display">
                        {insight.title}
                      </h4>
                      <p className="text-xs text-mutedText mt-1 leading-relaxed">
                        {insight.explanation}
                      </p>
                      <div className="mt-2 text-[11px] font-mono text-warmWhite/70 bg-midnight/60 px-2.5 py-1 rounded border border-elevated-border inline-block">
                        📊 {insight.supporting_data}
                      </div>
                      {insight.suggested_action && (
                        <p className="text-xs text-lime mt-2 font-medium flex items-center gap-1">
                          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                          <span>Suggested remedy: {insight.suggested_action}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleDismissInsight(insight.id)}
                    className="text-[11px] text-mutedText hover:text-warmWhite self-end sm:self-start px-2 py-1 rounded hover:bg-elevated/80 transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            );
          })}

          {visibleInsights.length === 0 && (
            <div className="p-8 text-center text-xs text-mutedText">
              All insights acknowledged. Team collaboration telemetry is stable.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

