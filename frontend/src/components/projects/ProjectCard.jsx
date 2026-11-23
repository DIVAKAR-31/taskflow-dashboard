import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  MoreVertical,
  Calendar,
  CheckCircle2,
  Users,
  Pencil,
  Trash2,
  ArrowRight,
} from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const canManage =
    isAdmin || (project.owner && project.owner._id === user?._id);

  const stats = project.stats || {
    totalTasks: 0,
    completedTasks: 0,
    progress: 0,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-soft-sm hover:shadow-soft-md transition-all flex flex-col justify-between overflow-hidden group">
      <div className="p-5">
        {/* Top Badges & Actions Menu */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant={project.status}>{project.status}</Badge>
            <Badge variant={project.priority}>{project.priority}</Badge>
            <span className="text-[11px] font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
              {project.category}
            </span>
          </div>

          {canManage && (
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setMenuOpen(!menuOpen);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>

              {menuOpen && (
                <div
                  className="absolute right-0 mt-1 w-36 bg-white rounded-xl shadow-soft-lg border border-slate-100 py-1.5 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(project);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="w-3.5 h-3.5 text-slate-500" />
                    <span>Edit Project</span>
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete(project);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Project Title & Description */}
        <div className="mb-4">
          <h3
            onClick={() => navigate(`/projects/${project._id}`)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer truncate"
          >
            {project.name}
          </h3>
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {project.description || 'No description provided.'}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5 mb-4">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className="text-slate-500">Task Completion</span>
            <span className="text-indigo-600 font-bold">{stats.progress}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${stats.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span>{stats.completedTasks} completed</span>
            <span>{stats.totalTasks} total</span>
          </div>
        </div>

        {/* Team Members Avatars */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div className="flex items-center -space-x-2">
            {project.members && project.members.length > 0 ? (
              project.members.slice(0, 4).map((member) => (
                <img
                  key={member._id}
                  src={
                    member.avatar ||
                    `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                      member.name
                    )}`
                  }
                  alt={member.name}
                  title={member.name}
                  className="w-6 h-6 rounded-full ring-2 ring-white object-cover"
                />
              ))
            ) : (
              <span className="text-xs text-slate-400 flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> No members yet
              </span>
            )}
            {project.members && project.members.length > 4 && (
              <span className="w-6 h-6 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600">
                +{project.members.length - 4}
              </span>
            )}
          </div>

          {project.endDate && (
            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>Due {formatDate(project.endDate)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Open Board */}
      <button
        onClick={() => navigate(`/projects/${project._id}`)}
        className="w-full py-2.5 px-4 bg-slate-50 hover:bg-indigo-50/70 border-t border-slate-100 text-xs font-semibold text-slate-600 hover:text-indigo-600 flex items-center justify-center gap-1.5 transition-colors"
      >
        <span>Open Project Board</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};

export default ProjectCard;
