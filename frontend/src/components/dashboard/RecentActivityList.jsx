import React from 'react';
import { Activity, Clock } from 'lucide-react';

const RecentActivityList = ({ activities = [] }) => {
  // Format relative time
  const formatTime = (dateString) => {
    if (!dateString) return 'Just now';
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-soft-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-800">Recent Activities</h3>
              <p className="text-xs text-slate-400">Live workspace audit trail</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {activities.length} entries
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="py-10 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm font-medium">No recent activities recorded yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-[360px] overflow-y-auto pr-1">
            {activities.map((act) => (
              <div key={act._id} className="py-3 flex items-start gap-3">
                <img
                  src={
                    act.user?.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      act.user?.name || 'User'
                    )}`
                  }
                  alt={act.user?.name}
                  className="w-7 h-7 rounded-full object-cover mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-700 leading-snug">
                    <span className="font-semibold text-slate-900">
                      {act.user?.name || 'System User'}
                    </span>{' '}
                    {act.details || act.action}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {act.project?.name && (
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-medium px-1.5 py-0.5 rounded">
                        {act.project.name}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">
                      {formatTime(act.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentActivityList;
