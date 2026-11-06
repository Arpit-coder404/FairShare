import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { 
  Bell, 
  CheckCheck, 
  Scale, 
  AlertCircle, 
  Clock, 
  Layers, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';

export const InboxPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markNotificationAsRead, 
    markAllNotificationsAsRead, 
    activeProjectId 
  } = useAppStore();

  const handleNotificationClick = (notif: typeof notifications[0]) => {
    markNotificationAsRead(notif.id);
    if (notif.type === 'rebalancing_proposal') {
      navigate(`/app/projects/${activeProjectId}/fairness`);
    } else if (notif.related_entity_type === 'task') {
      navigate(`/app/projects/${activeProjectId}/board`);
    } else {
      navigate(`/app/projects/${activeProjectId}`);
    }
  };

  const getNotifIcon = (type: typeof notifications[0]['type']) => {
    switch (type) {
      case 'rebalancing_proposal':
        return <Scale className="w-4 h-4 text-lime" />;
      case 'task_blocked':
        return <ShieldAlert className="w-4 h-4 text-coral" />;
      case 'task_assigned':
        return <Layers className="w-4 h-4 text-softBlue" />;
      case 'milestone_completed':
        return <CheckCircle2 className="w-4 h-4 text-lime" />;
      default:
        return <Bell className="w-4 h-4 text-mutedText" />;
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-warmWhite">
            Notifications & Alerts Inbox
          </h1>
          <p className="text-xs text-mutedText mt-1">
            Stay informed on task assignments, rebalance proposals, blocker updates, and milestone achievements.
          </p>
        </div>

        <button
          onClick={markAllNotificationsAsRead}
          className="px-4 py-2 bg-midnight hover:bg-elevated border border-elevated-border text-xs text-warmWhite font-semibold rounded-xl transition-all flex items-center gap-1.5 self-start"
        >
          <CheckCheck className="w-4 h-4 text-lime" /> Mark All as Read
        </button>
      </div>

      {/* Notifications List */}
      <div className="surface-elevated rounded-3xl p-6 border border-elevated-border space-y-3">
        {notifications.map(notif => {
          const isUnread = !notif.read_at;

          return (
            <div
              key={notif.id}
              onClick={() => handleNotificationClick(notif)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 text-xs group ${
                isUnread
                  ? 'bg-midnight border-lime/30 shadow-glow-lime/5'
                  : 'bg-midnight/50 border-elevated-border hover:border-mutedText/40'
              }`}
            >
              <div className="p-2.5 rounded-xl bg-elevated border border-elevated-border shrink-0 mt-0.5">
                {getNotifIcon(notif.type)}
              </div>

              <div className="flex-1 truncate">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`font-bold font-display ${isUnread ? 'text-warmWhite' : 'text-mutedText'}`}>
                    {notif.title}
                  </h4>
                  <span className="text-[10px] text-mutedText/70 font-mono shrink-0">
                    {new Date(notif.created_at).toLocaleDateString()}
                  </span>
                </div>

                <p className="text-mutedText mt-1 leading-relaxed">
                  {notif.message}
                </p>

                <div className="mt-2 flex items-center gap-2">
                  <span className="text-[10px] font-mono text-lime flex items-center gap-1 font-semibold group-hover:translate-x-0.5 transition-transform">
                    <span>View Details</span> <ArrowRight className="w-3 h-3" />
                  </span>
                  {isUnread && (
                    <span className="w-1.5 h-1.5 rounded-full bg-lime shrink-0" />
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {notifications.length === 0 && (
          <div className="p-12 text-center text-xs text-mutedText">
            No notifications in your inbox.
          </div>
        )}
      </div>
    </div>
  );
};

