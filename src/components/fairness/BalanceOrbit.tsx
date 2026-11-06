import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MemberMetric, Task } from '../../types';
import { User, AlertCircle, CheckCircle, Zap, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface BalanceOrbitProps {
  metrics: MemberMetric[];
  tasks: Task[];
  onSelectMember?: (member: MemberMetric) => void;
  selectedMemberId?: string | null;
}

export const BalanceOrbit: React.FC<BalanceOrbitProps> = ({
  metrics,
  tasks,
  onSelectMember,
  selectedMemberId,
}) => {
  const [activeMode, setActiveMode] = useState<'orbit' | 'collaborations'>('orbit');
  const [hoveredMember, setHoveredMember] = useState<MemberMetric | null>(null);
  const [internalSelected, setInternalSelected] = useState<MemberMetric | null>(null);

  const selected = metrics.find(m => m.user_id === selectedMemberId) || internalSelected || metrics[0];

  const handleSelect = (member: MemberMetric) => {
    setInternalSelected(member);
    if (onSelectMember) {
      onSelectMember(member);
    }
  };

  // Center coordinates of the orbit arena
  const cx = 300;
  const cy = 250;
  const radius = 160;

  // Compute node positions on the orbit ring based on index
  const memberNodes = metrics.map((m, index) => {
    const angle = (index / metrics.length) * 2 * Math.PI - Math.PI / 2;
    // Overloaded nodes deviate outwards slightly to signify orbital instability
    const rOffset = m.load_status === 'overloaded' ? 20 : m.load_status === 'underutilized' ? -15 : 0;
    const finalR = radius + rOffset;
    const x = cx + finalR * Math.cos(angle);
    const y = cy + finalR * Math.sin(angle);

    // Node radius proportional to assigned effort (min 26, max 46)
    const nodeRadius = Math.max(26, Math.min(46, 24 + m.assigned_effort * 1.5));

    // Color theme
    let color = '#C9FF5C'; // lime
    let pulseColor = 'rgba(201, 255, 92, 0.4)';
    if (m.load_status === 'overloaded') {
      color = '#FF786E'; // coral
      pulseColor = 'rgba(255, 120, 110, 0.5)';
    } else if (m.load_status === 'stretched') {
      color = '#FFB86E'; // amber-coral
      pulseColor = 'rgba(255, 184, 110, 0.4)';
    } else if (m.load_status === 'underutilized') {
      color = '#8EAFFF'; // soft blue
      pulseColor = 'rgba(142, 175, 255, 0.3)';
    }

    return {
      ...m,
      x,
      y,
      nodeRadius,
      color,
      pulseColor,
      angle,
    };
  });

  // Calculate collaboration links between members who work on dependencies or as collaborators
  const links: { source: typeof memberNodes[0]; target: typeof memberNodes[0]; label: string }[] = [];
  tasks.forEach(t => {
    if (t.dependencies && t.dependencies.length > 0) {
      t.dependencies.forEach(depId => {
        const depTask = tasks.find(other => other.id === depId);
        if (depTask && depTask.assignee_id !== t.assignee_id) {
          const source = memberNodes.find(n => n.user_id === depTask.assignee_id);
          const target = memberNodes.find(n => n.user_id === t.assignee_id);
          if (source && target && !links.some(l => (l.source.user_id === source.user_id && l.target.user_id === target.user_id))) {
            links.push({ source, target, label: `${depTask.title.slice(0, 18)}...` });
          }
        }
      });
    }
  });

  return (
    <div className="surface-elevated rounded-2xl p-6 border border-elevated-border relative overflow-hidden">
      {/* Background radial glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl"
        style={{
          background: selected?.load_status === 'overloaded' 
            ? 'radial-gradient(circle, #FF786E 0%, transparent 70%)' 
            : 'radial-gradient(circle, #C9FF5C 0%, transparent 70%)'
        }}
      />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-lime animate-pulse" />
            <h3 className="text-lg font-bold font-display text-warmWhite">The Balance Orbit</h3>
            <span className="px-2 py-0.5 text-xs font-mono rounded bg-midnight border border-elevated-border text-mutedText">
              Realtime System
            </span>
          </div>
          <p className="text-xs text-mutedText mt-1">
            Dynamic node size reflects effort points; orbital drift highlights load variance.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-midnight/80 p-1 rounded-xl border border-elevated-border self-start">
          <button
            onClick={() => setActiveMode('orbit')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'orbit'
                ? 'bg-elevated text-lime shadow-sm'
                : 'text-mutedText hover:text-warmWhite'
            }`}
          >
            Orbital Balance
          </button>
          <button
            onClick={() => setActiveMode('collaborations')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeMode === 'collaborations'
                ? 'bg-elevated text-lime shadow-sm'
                : 'text-mutedText hover:text-warmWhite'
            }`}
          >
            Dependencies ({links.length})
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Interactive SVG Orbit Arena */}
        <div className="lg:col-span-8 flex justify-center items-center relative min-h-[460px]">
          <svg
            viewBox="0 0 600 500"
            className="w-full max-w-[580px] h-auto select-none overflow-visible"
          >
            <defs>
              <linearGradient id="grad-orbit" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2E333E" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#C9FF5C" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#2E333E" stopOpacity="0.8" />
              </linearGradient>

              <filter id="glow-lime" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="6" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Orbit concentric track rings */}
            <circle
              cx={cx}
              cy={cy}
              r={radius - 40}
              fill="none"
              stroke="#20232B"
              strokeWidth="1.5"
              strokeDasharray="4 6"
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius}
              fill="none"
              stroke="url(#grad-orbit)"
              strokeWidth="1.5"
              strokeDasharray="8 8"
              className="animate-spin"
              style={{ transformOrigin: `${cx}px ${cy}px`, animationDuration: '90s' }}
            />
            <circle
              cx={cx}
              cy={cy}
              r={radius + 35}
              fill="none"
              stroke="#20232B"
              strokeWidth="1"
              strokeDasharray="2 4"
            />

            {/* Central Equilibrium Core */}
            <g>
              <circle
                cx={cx}
                cy={cy}
                r={36}
                fill="#17191F"
                stroke="#2E333E"
                strokeWidth="2"
              />
              <circle
                cx={cx}
                cy={cy}
                r={28}
                fill="#101114"
                stroke={selected?.load_status === 'overloaded' ? '#FF786E' : '#C9FF5C'}
                strokeWidth="1.5"
                opacity="0.8"
              />
              <text
                x={cx}
                y={cy - 4}
                textAnchor="middle"
                className="fill-warmWhite text-[11px] font-bold font-display"
              >
                FAIRSHARE
              </text>
              <text
                x={cx}
                y={cy + 12}
                textAnchor="middle"
                className="fill-mutedText text-[9px] font-mono tracking-wider"
              >
                NEXUS
              </text>
            </g>

            {/* Collaboration & Dependency Links */}
            {memberNodes.map(node => (
              <line
                key={`center-line-${node.user_id}`}
                x1={cx}
                y1={cy}
                x2={node.x}
                y2={node.y}
                stroke={node.color}
                strokeWidth={selected?.user_id === node.user_id ? '2' : '1'}
                strokeOpacity={selected?.user_id === node.user_id ? '0.6' : '0.15'}
                strokeDasharray={node.load_status === 'overloaded' ? '3 3' : 'none'}
              />
            ))}

            {activeMode === 'collaborations' &&
              links.map((link, idx) => (
                <g key={`dep-link-${idx}`}>
                  <path
                    d={`M ${link.source.x} ${link.source.y} Q ${cx} ${cy} ${link.target.x} ${link.target.y}`}
                    fill="none"
                    stroke="#8EAFFF"
                    strokeWidth="2"
                    strokeOpacity="0.7"
                    strokeDasharray="5 5"
                  />
                  <circle
                    cx={(link.source.x + link.target.x) / 2}
                    cy={(link.source.y + link.target.y) / 2}
                    r={3}
                    fill="#8EAFFF"
                  />
                </g>
              ))}

            {/* Member Orbit Nodes */}
            {memberNodes.map(node => {
              const isSelected = selected?.user_id === node.user_id;
              const isHovered = hoveredMember?.user_id === node.user_id;

              return (
                <g
                  key={node.user_id}
                  className="cursor-pointer transition-transform"
                  onClick={() => handleSelect(node)}
                  onMouseEnter={() => setHoveredMember(node)}
                  onMouseLeave={() => setHoveredMember(null)}
                >
                  {/* Subtle Pulse Aura for overloaded or selected nodes */}
                  {(node.load_status === 'overloaded' || isSelected) && (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.nodeRadius + 14}
                      fill={node.pulseColor}
                      className="animate-ping"
                      style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDuration: '3s' }}
                    />
                  )}

                  {/* Outer ring */}
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={node.nodeRadius + (isSelected ? 5 : 2)}
                    fill="#17191F"
                    stroke={node.color}
                    strokeWidth={isSelected ? '3' : '2'}
                  />

                  {/* Inner Node Background */}
                  <clipPath id={`clip-${node.user_id}`}>
                    <circle cx={node.x} cy={node.y} r={node.nodeRadius} />
                  </clipPath>

                  {node.avatar_url ? (
                    <image
                      href={node.avatar_url}
                      x={node.x - node.nodeRadius}
                      y={node.y - node.nodeRadius}
                      width={node.nodeRadius * 2}
                      height={node.nodeRadius * 2}
                      clipPath={`url(#clip-${node.user_id})`}
                      preserveAspectRatio="xMidYMid slice"
                      opacity={isSelected || isHovered ? 1 : 0.85}
                    />
                  ) : (
                    <circle
                      cx={node.x}
                      cy={node.y}
                      r={node.nodeRadius}
                      fill="#262A34"
                    />
                  )}

                  {/* Effort Badge */}
                  <g transform={`translate(${node.x + node.nodeRadius * 0.7}, ${node.y - node.nodeRadius * 0.7})`}>
                    <circle
                      cx="0"
                      cy="0"
                      r="12"
                      fill="#101114"
                      stroke={node.color}
                      strokeWidth="1.5"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      className="fill-warmWhite text-[10px] font-bold font-mono"
                    >
                      {node.assigned_effort}p
                    </text>
                  </g>

                  {/* Label under node */}
                  <text
                    x={node.x}
                    y={node.y + node.nodeRadius + 16}
                    textAnchor="middle"
                    className="fill-warmWhite text-[12px] font-semibold font-display"
                  >
                    {node.name.split(' ')[0]}
                  </text>
                  <text
                    x={node.x}
                    y={node.y + node.nodeRadius + 28}
                    textAnchor="middle"
                    className="fill-mutedText text-[10px] font-mono"
                  >
                    {node.utilization_pct}% load
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Member Contribution Detail Panel */}
        <div className="lg:col-span-4 bg-midnight/90 rounded-xl p-5 border border-elevated-border relative">
          <div className="flex items-start justify-between gap-3 pb-4 border-b border-elevated-border">
            <div className="flex items-center gap-3">
              <img
                src={selected.avatar_url}
                alt={selected.name}
                className="w-12 h-12 rounded-full border-2 object-cover"
                style={{
                  borderColor:
                    selected.load_status === 'overloaded'
                      ? '#FF786E'
                      : selected.load_status === 'underutilized'
                      ? '#8EAFFF'
                      : '#C9FF5C',
                }}
              />
              <div>
                <h4 className="font-bold text-warmWhite text-base font-display">{selected.name}</h4>
                <p className="text-xs text-mutedText">{selected.role}</p>
              </div>
            </div>

            <span
              className={`px-2.5 py-1 text-xs font-semibold rounded-full uppercase tracking-wider ${
                selected.load_status === 'overloaded'
                  ? 'bg-coral/15 text-coral border border-coral/30'
                  : selected.load_status === 'underutilized'
                  ? 'bg-softBlue/15 text-softBlue border border-softBlue/30'
                  : 'bg-lime/15 text-lime border border-lime/30'
              }`}
            >
              {selected.load_status}
            </span>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 my-4">
            <div className="bg-elevated p-3 rounded-lg border border-elevated-border">
              <span className="text-[11px] text-mutedText block">Assigned Workload</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-warmWhite">
                  {selected.assigned_effort}
                </span>
                <span className="text-xs text-mutedText font-mono">/ {selected.capacity_points} pts</span>
              </div>
              <div className="w-full bg-midnight h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${
                    selected.load_status === 'overloaded' ? 'bg-coral' : 'bg-lime'
                  }`}
                  style={{ width: `${Math.min(100, selected.utilization_pct)}%` }}
                />
              </div>
            </div>

            <div className="bg-elevated p-3 rounded-lg border border-elevated-border">
              <span className="text-[11px] text-mutedText block">Completed Deliverables</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-bold font-mono text-lime">
                  {selected.completed_effort}
                </span>
                <span className="text-xs text-mutedText font-mono">pts delivered</span>
              </div>
              <span className="text-[10px] text-mutedText mt-2 block">
                {selected.completed_tasks_count} verified tasks
              </span>
            </div>
          </div>

          {/* Active Tasks Assigned */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-warmWhite">Active Assigned Tasks</span>
              <span className="text-mutedText font-mono">{selected.active_tasks_count} items</span>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {tasks
                .filter(t => t.assignee_id === selected.user_id && t.status !== 'done')
                .map(task => (
                  <div
                    key={task.id}
                    className="p-2.5 bg-elevated/70 hover:bg-elevated rounded-lg border border-elevated-border text-xs flex items-center justify-between gap-2"
                  >
                    <div className="truncate">
                      <span className="text-warmWhite font-medium block truncate">
                        {task.title}
                      </span>
                      <span className="text-[10px] text-mutedText flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-mutedText" />
                        Due {task.due_date}
                        {task.is_blocked && (
                          <span className="text-coral font-medium ml-1 flex items-center gap-0.5">
                            <AlertCircle className="w-3 h-3" /> Blocked
                          </span>
                        )}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-midnight border border-elevated-border font-mono text-[11px] text-lime font-bold shrink-0">
                      {task.estimated_effort}p
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {/* Skills tags */}
          <div className="mt-4 pt-3 border-t border-elevated-border">
            <span className="text-[11px] text-mutedText block mb-1.5">Registered Expertise</span>
            <div className="flex flex-wrap gap-1.5">
              {selected.skills.map((skill, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 text-[10px] rounded bg-elevated border border-elevated-border text-warmWhite"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

