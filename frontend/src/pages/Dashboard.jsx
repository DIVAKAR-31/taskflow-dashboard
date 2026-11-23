import React, { useEffect, useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import StatsOverview from '../components/dashboard/StatsOverview';
import ProgressChart from '../components/dashboard/ProgressChart';
import RecentActivityList from '../components/dashboard/RecentActivityList';
import QuickActions from '../components/dashboard/QuickActions';
import ProjectModal from '../components/projects/ProjectModal';
import { Sparkles, Loader2, ArrowRight, FolderKanban } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { fetchDashboardStats, stats, loading, projects, fetchProjects } = useProjects();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    fetchDashboardStats();
    fetchProjects();
  }, [fetchDashboardStats, fetchProjects]);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-soft-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
            <Sparkles className="w-4 h-4" />
            <span>TaskFlow Agile Workspace</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isAdmin
              ? 'Here is an administrative overview of projects, sprint health and team tasks.'
              : 'Here is your active project portfolio and assigned deliverables.'}
          </p>
        </div>

        <QuickActions
          onOpenCreateProject={() => setIsCreateModalOpen(true)}
        />
      </div>

      {loading && !stats ? (
        <div className="py-20 flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
          <p className="text-xs text-slate-400 font-medium">Loading workspace metrics...</p>
        </div>
      ) : (
        <>
          {/* Key Stat Cards */}
          <StatsOverview stats={stats} />

          {/* Progress Overview & Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProgressChart stats={stats} />
            <RecentActivityList activities={stats?.recentActivities} />
          </div>

          {/* Active Projects Fast Access List */}
          <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-soft-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-slate-800">
                  Active Project Boards
                </h3>
                <p className="text-xs text-slate-400">
                  Jump directly into sprint Kanban boards
                </p>
              </div>
              <button
                onClick={() => navigate('/projects')}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
              >
                <span>View All ({projects.length})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="py-8 text-center text-slate-400">
                <FolderKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-xs font-medium">No projects found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {projects.slice(0, 3).map((proj) => (
                  <div
                    key={proj._id}
                    onClick={() => navigate(`/projects/${proj._id}`)}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-indigo-50/40 hover:border-indigo-200 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {proj.category}
                      </span>
                      <span className="text-xs font-bold text-indigo-600">
                        {proj.stats?.progress ?? 0}%
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 truncate mb-1">
                      {proj.name}
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-3">
                      {proj.description || 'No description'}
                    </p>
                    <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-indigo-600 rounded-full"
                        style={{ width: `${proj.stats?.progress ?? 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          fetchDashboardStats();
          fetchProjects();
        }}
      />
    </div>
  );
};

export default Dashboard;
