import React from 'react';
import { Plus, FolderPlus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const QuickActions = ({ onOpenCreateProject }) => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  return (
    <div className="flex flex-wrap items-center gap-3">
      {isAdmin && (
        <button
          onClick={onOpenCreateProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-soft-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FolderPlus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      )}

      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200/80 shadow-soft-sm transition-colors"
      >
        <span>View Project Boards</span>
      </button>

      <button
        onClick={() => navigate('/team')}
        className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold rounded-xl border border-slate-200/80 shadow-soft-sm transition-colors"
      >
        <Users className="w-4 h-4 text-slate-500" />
        <span>Team</span>
      </button>
    </div>
  );
};

export default QuickActions;
