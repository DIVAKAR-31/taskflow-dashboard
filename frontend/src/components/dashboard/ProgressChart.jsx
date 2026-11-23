import React from 'react';
import { TrendingUp, AlertCircle, CircleDot } from 'lucide-react';

const ProgressChart = ({ stats }) => {
  const overallProgress = stats?.overallProgress ?? 0;
  const priority = stats?.priorityBreakdown || { high: 0, medium: 0, low: 0 };
  const projects = stats?.projectsProgress || [];

  return (
    <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-soft-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-800">
            Sprint & Progress Overview
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time completion metrics across teams
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold">
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{overallProgress}% Total Done</span>
        </div>
      </div>

      {/* Main Overall Progress bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600">
          <span>Overall Workspace Velocity</span>
          <span>{overallProgress}%</span>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(overallProgress, 2)}%` }}
          />
        </div>
      </div>

      {/* Priority distribution badges */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 bg-rose-50/60 rounded-xl border border-rose-100/60 text-center">
          <span className="block text-[11px] font-semibold text-rose-600 uppercase tracking-wider">
            High Priority
          </span>
          <span className="text-lg font-bold text-rose-700">{priority.high}</span>
        </div>
        <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100/60 text-center">
          <span className="block text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
            Medium
          </span>
          <span className="text-lg font-bold text-amber-700">{priority.medium}</span>
        </div>
        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100/60 text-center">
          <span className="block text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
            Low Priority
          </span>
          <span className="text-lg font-bold text-emerald-700">{priority.low}</span>
        </div>
      </div>

      {/* Project Breakdown */}
      {projects.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Active Project Delivery
          </h4>
          <div className="space-y-2.5">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700 truncate max-w-[200px]">
                    {proj.name}
                  </span>
                  <span className="text-slate-500 text-[11px] font-semibold">
                    {proj.completedTasks}/{proj.totalTasks} tasks ({proj.percentage}%)
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${proj.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressChart;
