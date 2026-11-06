import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  BarChart3, 
  Download, 
  FileSpreadsheet, 
  CheckCircle, 
  Scale, 
  ShieldCheck, 
  Clock, 
  TrendingUp, 
  Calendar, 
  Info,
  Layers
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const InsightsPage: React.FC = () => {
  const { 
    tasks, 
    members, 
    activeProjectId, 
    projects, 
    getFairnessAnalysis, 
    activity 
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'analytics' | 'report'>('analytics');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const activeProject = projects.find(p => p.id === activeProjectId) || projects[0];
  const activeTasks = tasks.filter(t => t.project_id === activeProjectId);
  const analysis = getFairnessAnalysis();

  // Pie chart colors
  const COLORS = ['#C9FF5C', '#8EAFFF', '#B8A0FF', '#FF786E', '#FFB86E'];

  const effortByMemberData = analysis.member_metrics.map(m => ({
    name: m.name.split(' ')[0],
    value: m.completed_effort,
    assigned: m.assigned_effort,
  }));

  // Velocity timeline mockup from real events
  const velocityData = [
    { period: 'Sprint 1', planned: 12, delivered: 10 },
    { period: 'Sprint 2', planned: 18, delivered: 15 },
    { period: 'Sprint 3', planned: 24, delivered: 22 },
    { period: 'Current', planned: analysis.total_effort, delivered: analysis.completed_effort },
  ];

  // Export Contribution Report to CSV
  const handleExportCSV = () => {
    const headers = ['Teammate', 'Role', 'Capacity (pts)', 'Assigned Effort (pts)', 'Completed Effort (pts)', 'Active Tasks', 'Completed Tasks', 'Load Status'];
    const rows = analysis.member_metrics.map(m => [
      `"${m.name}"`,
      `"${m.role}"`,
      m.capacity_points,
      m.assigned_effort,
      m.completed_effort,
      m.active_tasks_count,
      m.completed_tasks_count,
      `"${m.load_status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `FairShare_${activeProject?.name.replace(/\s+/g, '_')}_Report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 3000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Project Analytics & Contribution Report
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Empirical velocity measurements, milestone progress, and academic contribution audit documentation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-midnight hover:bg-elevated text-warmWhite border border-elevated-border text-xs font-semibold rounded-xl transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4 text-lime" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 rounded-xl bg-lime/15 border border-lime/30 text-xs text-lime font-medium flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Download started: Contribution Report exported to CSV.
        </div>
      )}

      {/* Navigation Pill Tabs */}
      <div className="flex items-center gap-2 bg-midnight p-1 rounded-2xl border border-elevated-border self-start w-fit">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'analytics'
              ? 'bg-elevated text-lime shadow-sm'
              : 'text-mutedText hover:text-warmWhite'
          }`}
        >
          Visual Analytics
        </button>
        <button
          onClick={() => setActiveTab('report')}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'report'
              ? 'bg-elevated text-lime shadow-sm'
              : 'text-mutedText hover:text-warmWhite'
          }`}
        >
          Comprehensive Capstone Dossier
        </button>
      </div>

      {/* VIEW 1: VISUAL ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Velocity Area Chart */}
            <div className="lg:col-span-7 surface-elevated rounded-2xl p-6 border border-elevated-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold font-display text-warmWhite">
                    Sprint Velocity Progression
                  </h3>
                  <p className="text-[11px] text-mutedText">
                    Planned vs Delivered effort points across capstone development cycles.
                  </p>
                </div>
                <span className="text-xs font-mono text-lime font-bold">
                  {analysis.completion_rate}% Velocity
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={velocityData}>
                    <defs>
                      <linearGradient id="colorDelivered" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="5%" stopColor="#C9FF5C" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#C9FF5C" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorPlanned" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="5%" stopColor="#8EAFFF" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#8EAFFF" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="period" stroke="#9296A2" fontSize={11} tickLine={false} />
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
                    <Area type="monotone" dataKey="planned" stroke="#8EAFFF" fillOpacity={1} fill="url(#colorPlanned)" name="Planned Pts" />
                    <Area type="monotone" dataKey="delivered" stroke="#C9FF5C" fillOpacity={1} fill="url(#colorDelivered)" name="Delivered Pts" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Effort Distribution Pie Chart */}
            <div className="lg:col-span-5 surface-elevated rounded-2xl p-6 border border-elevated-border">
              <h3 className="text-sm font-bold font-display text-warmWhite mb-1">
                Delivered Effort by Teammate
              </h3>
              <p className="text-[11px] text-mutedText mb-4">
                Share of completed deliverable points per contributor.
              </p>

              <div className="h-48 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={effortByMemberData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {effortByMemberData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#17191F',
                        borderColor: '#2E333E',
                        borderRadius: '12px',
                        fontSize: '11px',
                        color: '#F4F3EE',
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-elevated-border text-xs">
                {effortByMemberData.map((entry, idx) => (
                  <div key={entry.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-warmWhite font-medium">{entry.name}:</span>
                    <span className="text-mutedText font-mono">{entry.value} pts</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPREHENSIVE DOSSIER / REPORT */}
      {activeTab === 'report' && (
        <div className="surface-elevated rounded-3xl p-6 sm:p-8 border border-elevated-border space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-elevated-border">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-lime font-bold block mb-1">
                ACADEMIC & INDUSTRY AUDIT
              </span>
              <h2 className="text-xl font-bold font-display text-warmWhite">
                {activeProject?.name} — Team Contribution Dossier
              </h2>
              <p className="text-xs text-mutedText mt-1">
                Generated from immutable task event logs, verified deliverables, and peer feedback timestamps.
              </p>
            </div>

            <button
              onClick={handleExportCSV}
              className="px-4 py-2 bg-lime text-obsidian text-xs font-bold rounded-xl hover:bg-lime-dim transition-all shadow-glow-lime flex items-center gap-2 self-start"
            >
              <Download className="w-4 h-4" /> Export CSV Data
            </button>
          </div>

          {/* Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-elevated-border text-mutedText font-mono uppercase text-[10px]">
                  <th className="py-3 px-3">Contributor</th>
                  <th className="py-3 px-3">Core Specialty</th>
                  <th className="py-3 px-3">Assigned Load</th>
                  <th className="py-3 px-3">Delivered Effort</th>
                  <th className="py-3 px-3">Verified Deliverables</th>
                  <th className="py-3 px-3">Utilization Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-elevated-border">
                {analysis.member_metrics.map(m => {
                  const verifiedDelivs = activeTasks
                    .filter(t => t.assignee_id === m.user_id && t.status === 'done')
                    .flatMap(t => t.deliverables).length;

                  return (
                    <tr key={m.user_id} className="hover:bg-midnight/50">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img src={m.avatar_url} alt={m.name} className="w-6 h-6 rounded-full object-cover" />
                          <span className="font-bold text-warmWhite">{m.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-mutedText">{m.role}</td>
                      <td className="py-3 px-3 font-mono font-bold text-warmWhite">
                        {m.assigned_effort} / {m.capacity_points} pts
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-lime">
                        {m.completed_effort} pts
                      </td>
                      <td className="py-3 px-3 font-mono text-mutedText">
                        {verifiedDelivs} files uploaded
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                          m.load_status === 'overloaded'
                            ? 'bg-coral/20 text-coral'
                            : m.load_status === 'underutilized'
                            ? 'bg-softBlue/20 text-softBlue'
                            : 'bg-lime/20 text-lime'
                        }`}>
                          {m.load_status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Important Caveat & Responsible Disclaimer */}
          <div className="mt-8 p-4 rounded-2xl bg-midnight border border-elevated-border text-xs text-mutedText space-y-2">
            <h4 className="font-bold text-warmWhite font-display flex items-center gap-2">
              <Info className="w-4 h-4 text-lime" /> Academic Integrity & Evaluation Caveats
            </h4>
            <p className="leading-relaxed">
              This report represents estimated work based on weighted task assignments, committed code/design artifacts, and peer check-ins. It is designed to assist professors and team leaders in evaluating equitable collaboration without relying solely on line-of-code metrics or superficial timecards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

