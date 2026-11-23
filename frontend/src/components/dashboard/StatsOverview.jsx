import React from 'react';
import { FolderKanban, CheckCircle2, Clock, CheckSquare } from 'lucide-react';
import StatCard from '../common/StatCard';

const StatsOverview = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Projects"
        value={stats?.totalProjects ?? 0}
        icon={FolderKanban}
        color="indigo"
        subtitle="Active workspace initiatives"
      />
      <StatCard
        title="Total Tasks"
        value={stats?.totalTasks ?? 0}
        icon={CheckSquare}
        color="blue"
        subtitle="Across all project boards"
      />
      <StatCard
        title="Completed Tasks"
        value={stats?.completedTasks ?? 0}
        icon={CheckCircle2}
        color="emerald"
        subtitle={`${stats?.overallProgress ?? 0}% overall completion`}
      />
      <StatCard
        title="Pending Tasks"
        value={stats?.pendingTasks ?? 0}
        icon={Clock}
        color="amber"
        subtitle="To Do & In Progress"
      />
    </div>
  );
};

export default StatsOverview;
