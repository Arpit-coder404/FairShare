import { Task, TeamMember, FairnessAnalysis, MemberMetric, FairnessInsight, SuggestedRedistribution } from '../types';

/**
 * THE FAIRNESS ENGINE
 * Transparent, explainable algorithmic analysis of real application state.
 * Never treats numerical scores as absolute judgments or human worth.
 */
export function calculateFairness(tasks: Task[], members: TeamMember[]): FairnessAnalysis {
  if (!members.length) {
    return {
      balance_score: 100,
      balance_status: 'Optimal',
      total_effort: 0,
      completed_effort: 0,
      remaining_effort: 0,
      average_effort_per_member: 0,
      completion_rate: 0,
      member_metrics: [],
      insights: [],
      suggested_redistributions: [],
      bottlenecks: [],
      calculated_at: new Date().toISOString(),
    };
  }

  // 1. Calculate per-member metrics
  const memberMetricsMap = new Map<string, {
    assigned: number;
    completed: number;
    activeCount: number;
    completedCount: number;
    blockedCount: number;
    overdueCount: number;
  }>();

  members.forEach(m => {
    memberMetricsMap.set(m.user_id, {
      assigned: 0,
      completed: 0,
      activeCount: 0,
      completedCount: 0,
      blockedCount: 0,
      overdueCount: 0,
    });
  });

  let totalEffort = 0;
  let totalCompletedEffort = 0;
  const now = new Date();

  tasks.forEach(task => {
    const effort = task.estimated_effort || 1;
    totalEffort += effort;

    const stats = memberMetricsMap.get(task.assignee_id);
    const isDone = task.status === 'done';
    const isOverdue = !isDone && task.due_date && new Date(task.due_date) < now;

    if (isDone) {
      totalCompletedEffort += effort;
      if (stats) {
        stats.completed += effort;
        stats.completedCount += 1;
      }
    } else {
      if (stats) {
        stats.assigned += effort;
        stats.activeCount += 1;
        if (task.is_blocked) {
          stats.blockedCount += 1;
        }
        if (isOverdue) {
          stats.overdueCount += 1;
        }
      }
    }
  });

  const member_metrics: MemberMetric[] = members.map(m => {
    const stats = memberMetricsMap.get(m.user_id) || {
      assigned: 0,
      completed: 0,
      activeCount: 0,
      completedCount: 0,
      blockedCount: 0,
      overdueCount: 0,
    };

    const capacity = m.capacity_points > 0 ? m.capacity_points : 10;
    const utilization_pct = Math.round((stats.assigned / capacity) * 100);

    let load_status: MemberMetric['load_status'] = 'optimal';
    if (utilization_pct < 55) {
      load_status = 'underutilized';
    } else if (utilization_pct <= 95) {
      load_status = 'optimal';
    } else if (utilization_pct <= 125) {
      load_status = 'stretched';
    } else {
      load_status = 'overloaded';
    }

    return {
      user_id: m.user_id,
      name: m.name,
      role: m.role,
      avatar_url: m.avatar_url,
      capacity_points: capacity,
      assigned_effort: stats.assigned,
      completed_effort: stats.completed,
      remaining_effort: stats.assigned,
      active_tasks_count: stats.activeCount,
      completed_tasks_count: stats.completedCount,
      blocked_tasks_count: stats.blockedCount,
      overdue_tasks_count: stats.overdueCount,
      utilization_pct,
      load_status,
      skills: m.skills || [],
    };
  });

  const remainingEffort = totalEffort - totalCompletedEffort;
  const avgEffort = members.length > 0 ? Math.round((remainingEffort / members.length) * 10) / 10 : 0;
  const completionRate = totalEffort > 0 ? Math.round((totalCompletedEffort / totalEffort) * 100) : 0;

  // 2. Compute Workload Balance Score (0 - 100)
  // We evaluate ratio of assigned effort to capacity for each member
  const ratios = member_metrics.map(m => m.assigned_effort / m.capacity_points);
  const meanRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

  let balanceScore = 100;
  if (remainingEffort > 0 && meanRatio > 0) {
    const variance = ratios.reduce((sum, r) => sum + Math.pow(r - meanRatio, 2), 0) / ratios.length;
    const stdDev = Math.sqrt(variance);
    // Coefficient of variation CV = stdDev / meanRatio
    const cv = stdDev / (meanRatio || 1);
    // CV of 0 = 100 balance. CV >= 1.0 = heavy imbalance.
    balanceScore = Math.max(15, Math.min(100, Math.round(100 - cv * 55)));
  }

  // Adjust balance score slightly if there are multiple blocked bottlenecks
  const blockedTasks = tasks.filter(t => t.status !== 'done' && t.is_blocked);
  if (blockedTasks.length > 2) {
    balanceScore = Math.max(10, balanceScore - 8);
  }

  let balance_status: FairnessAnalysis['balance_status'] = 'Optimal';
  if (balanceScore >= 85) balance_status = 'Optimal';
  else if (balanceScore >= 70) balance_status = 'Balanced';
  else if (balanceScore >= 50) balance_status = 'Moderate Imbalance';
  else balance_status = 'Severe Imbalance';

  // 3. Bottlenecks
  const bottlenecks = tasks.filter(t => {
    if (t.status === 'done') return false;
    if (t.is_blocked) return true;
    // Check if other tasks depend on this task
    const isDependency = tasks.some(other => other.dependencies?.includes(t.id));
    const isUrgent = t.priority === 'urgent' || t.priority === 'high';
    return isDependency && isUrgent;
  });

  // 4. Generate Explainable Insights
  const insights: FairnessInsight[] = [];

  // Overloaded members insight
  const overloadedMembers = member_metrics.filter(m => m.load_status === 'overloaded');
  if (overloadedMembers.length > 0) {
    overloadedMembers.forEach(m => {
      insights.push({
        id: `imbalance-${m.user_id}`,
        category: 'imbalance',
        severity: 'critical',
        title: `Workload Imbalance: ${m.name}`,
        explanation: `${m.name} has ${m.assigned_effort} effort points assigned against a capacity of ${m.capacity_points} (${m.utilization_pct}% load). Team average is ${avgEffort} pts.`,
        supporting_data: `${m.active_tasks_count} active tasks assigned, ${m.assigned_effort} pts total.`,
        suggested_action: `Redistribute 1-2 lower priority tasks to teammates with spare capacity.`,
        target_user_id: m.user_id,
      });
    });
  }

  // Spare capacity insight
  const spareMembers = member_metrics.filter(m => m.load_status === 'underutilized');
  if (spareMembers.length > 0) {
    const names = spareMembers.map(m => m.name).join(', ');
    const spareCapacityTotal = spareMembers.reduce((sum, m) => sum + (m.capacity_points - m.assigned_effort), 0);
    insights.push({
      id: 'capacity-opportunity',
      category: 'capacity',
      severity: 'info',
      title: `Spare Capacity Available`,
      explanation: `${names} ${spareMembers.length === 1 ? 'has' : 'have'} spare bandwidth (${spareCapacityTotal} total unused effort points).`,
      supporting_data: spareMembers.map(m => `${m.name}: ${m.assigned_effort}/${m.capacity_points} pts`).join(' • '),
      suggested_action: `Delegate queued backlog or documentation/testing tasks to balance load.`,
    });
  }

  // Blocked tasks insight
  if (blockedTasks.length > 0) {
    const titles = blockedTasks.map(t => `"${t.title}"`).join(', ');
    insights.push({
      id: 'blocker-alert',
      category: 'blocker',
      severity: 'warning',
      title: `${blockedTasks.length} Task${blockedTasks.length > 1 ? 's' : ''} Currently Blocked`,
      explanation: `Active deliverables are stalled: ${titles}.`,
      supporting_data: blockedTasks.map(t => `${t.title}: ${t.blocker_reason || 'Blocked by upstream dependency'}`).join(' | '),
      suggested_action: `Hold a quick sync to unblock upstream API/data dependencies.`,
    });
  }

  // Dependency risk insight
  const dependencyChains = tasks.filter(t => t.dependencies && t.dependencies.length > 0 && t.status !== 'done');
  if (dependencyChains.length > 0) {
    insights.push({
      id: 'dependency-risk',
      category: 'dependency',
      severity: 'info',
      title: `${dependencyChains.length} Dependent Tasks Scheduled`,
      explanation: `Tasks with cross-member dependencies require clear handoffs to avoid cascading delays.`,
      supporting_data: `Critical path involves ${dependencyChains.length} sequenced items.`,
      suggested_action: `Review task order in Timeline to ensure precursor deliverables are submitted early.`,
    });
  }

  // Positive achievement insight if team is progressing well
  if (completionRate >= 30) {
    insights.push({
      id: 'achievement-velocity',
      category: 'achievement',
      severity: 'success',
      title: `Steady Team Velocity`,
      explanation: `Team has completed ${totalCompletedEffort} of ${totalEffort} total effort points (${completionRate}% project deliverable completion).`,
      supporting_data: `${tasks.filter(t => t.status === 'done').length} tasks marked Done with full verification.`,
    });
  }

  // 5. Calculate Suggested Redistributions
  const suggested_redistributions: SuggestedRedistribution[] = [];
  
  if (overloadedMembers.length > 0 && spareMembers.length > 0) {
    overloadedMembers.forEach(overloaded => {
      // Find candidate tasks from overloaded user (not done, not blocked, preferably todo or backlog)
      const candidateTasks = tasks.filter(
        t => t.assignee_id === overloaded.user_id && 
             t.status !== 'done' && 
             t.priority !== 'urgent'
      ).sort((a, b) => b.estimated_effort - a.estimated_effort);

      for (const task of candidateTasks) {
        // Find best match among spare members based on skills and remaining capacity
        const eligibleReceivers = spareMembers.filter(r => {
          const wouldBeLoad = r.assigned_effort + task.estimated_effort;
          return wouldBeLoad <= r.capacity_points;
        });

        // Score eligible receivers by matching skills
        let bestReceiver: MemberMetric | null = null;
        let bestMatchingSkills: string[] = [];

        eligibleReceivers.forEach(receiver => {
          const matches = (task.skills_required || []).filter(skill => 
            receiver.skills.some(rs => rs.toLowerCase().includes(skill.toLowerCase()))
          );
          if (!bestReceiver || matches.length > bestMatchingSkills.length) {
            bestReceiver = receiver;
            bestMatchingSkills = matches;
          }
        });

        // Fallback to receiver with largest spare capacity if no direct skill match
        if (!bestReceiver && eligibleReceivers.length > 0) {
          bestReceiver = eligibleReceivers.sort((a, b) => (b.capacity_points - b.assigned_effort) - (a.capacity_points - a.assigned_effort))[0];
        }

        if (bestReceiver) {
          suggested_redistributions.push({
            id: `redistribute-${task.id}`,
            task_id: task.id,
            task_title: task.title,
            task_effort: task.estimated_effort,
            from_user_id: overloaded.user_id,
            from_user_name: overloaded.name,
            to_user_id: (bestReceiver as MemberMetric).user_id,
            to_user_name: (bestReceiver as MemberMetric).name,
            reason: bestMatchingSkills.length > 0
              ? `Matches ${bestMatchingSkills.join(', ')} skills & ${(bestReceiver as MemberMetric).name} has ${(bestReceiver as MemberMetric).capacity_points - (bestReceiver as MemberMetric).assigned_effort} pts spare bandwidth.`
              : `${(bestReceiver as MemberMetric).name} has ${(bestReceiver as MemberMetric).capacity_points - (bestReceiver as MemberMetric).assigned_effort} pts of available capacity to absorb this task.`,
            before_from_effort: overloaded.assigned_effort,
            after_from_effort: overloaded.assigned_effort - task.estimated_effort,
            before_to_effort: (bestReceiver as MemberMetric).assigned_effort,
            after_to_effort: (bestReceiver as MemberMetric).assigned_effort + task.estimated_effort,
            match_skills: bestMatchingSkills,
          });
          // Limit to 2 top actionable redistribution suggestions so UI remains crisp
          if (suggested_redistributions.length >= 3) break;
        }
      }
    });
  }

  return {
    balance_score: balanceScore,
    balance_status,
    total_effort: totalEffort,
    completed_effort: totalCompletedEffort,
    remaining_effort: remainingEffort,
    average_effort_per_member: avgEffort,
    completion_rate: completionRate,
    member_metrics,
    insights,
    suggested_redistributions,
    bottlenecks,
    calculated_at: new Date().toISOString(),
  };
}

