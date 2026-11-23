import React, { useState } from 'react';
import {
  Calendar,
  MoreVertical,
  Pencil,
  Trash2,
  ChevronRight,
  ChevronLeft,
  GripVertical,
} from 'lucide-react';
import Badge from '../common/Badge';
import { useAuth } from '../../context/AuthContext';

const TaskCard = ({
  task,
  onEdit,
  onDelete,
  onMoveStatus,
  onDragStart,
  onDragEnd,
}) => {
  const { user, isAdmin } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const canEdit =
    isAdmin ||
    task.createdBy?._id === user?._id ||
    task.assignedTo?._id === user?._id;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    const isPast = d < new Date() && task.status !== 'Completed';
    return {
      text: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      isOverdue: isPast,
    };
  };

  const due = formatDate(task.dueDate);

  // Status progression helpers
  const nextStatusMap = {
    'To Do': 'In Progress',
    'In Progress': 'Completed',
  };
  const prevStatusMap = {
    'In Progress': 'To Do',
    'Completed': 'In Progress',
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      onDragEnd={onDragEnd}
      className="task-card bg-white p-4 rounded-xl border border-slate-200/80 shadow-soft-sm cursor-grab active:cursor-grabbing hover:border-indigo-300 relative group"
    >
      {/* Top Header: Drag handle, Priority Badge, Actions */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400" />
          <Badge variant={task.priority} size="xs">
            {task.priority}
          </Badge>
        </div>

        {canEdit && (
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <MoreVertical className="w-3.5 h-3.5" />
            </button>

            {menuOpen && (
              <div
                className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-soft-lg border border-slate-100 py-1 z-30"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onEdit(task);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <Pencil className="w-3 h-3 text-slate-400" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    onDelete(task);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Task Title */}
      <h4
        onClick={() => canEdit && onEdit(task)}
        className="text-xs font-semibold text-slate-800 leading-snug hover:text-indigo-600 cursor-pointer mb-1.5"
      >
        {task.title}
      </h4>

      {/* Description Preview */}
      {task.description && (
        <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed mb-3">
          {task.description}
        </p>
      )}

      {/* Tags if any */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.map((tag, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Card Footer: Assignee & Due Date */}
      <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-[11px]">
        {/* Assignee */}
        <div className="flex items-center gap-1.5">
          {task.assignedTo ? (
            <div className="flex items-center gap-1.5">
              <img
                src={
                  task.assignedTo.avatar ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                    task.assignedTo.name
                  )}`
                }
                alt={task.assignedTo.name}
                title={`Assigned to ${task.assignedTo.name}`}
                className="w-5 h-5 rounded-full object-cover ring-1 ring-slate-200"
              />
              <span className="text-[11px] text-slate-600 font-medium truncate max-w-[80px]">
                {task.assignedTo.name.split(' ')[0]}
              </span>
            </div>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Unassigned</span>
          )}
        </div>

        {/* Due Date */}
        {due && (
          <div
            className={`flex items-center gap-1 font-medium ${
              due.isOverdue ? 'text-rose-600 font-semibold' : 'text-slate-400'
            }`}
          >
            <Calendar className="w-3 h-3" />
            <span>{due.text}</span>
          </div>
        )}
      </div>

      {/* Quick Move Status Buttons (for accessibility / mobile touch) */}
      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-50 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {prevStatusMap[task.status] ? (
          <button
            onClick={() => onMoveStatus(task, prevStatusMap[task.status])}
            title={`Move back to ${prevStatusMap[task.status]}`}
            className="flex items-center gap-0.5 text-[10px] font-semibold text-slate-500 hover:text-indigo-600 px-1.5 py-0.5 rounded hover:bg-slate-100"
          >
            <ChevronLeft className="w-3 h-3" />
            <span>{prevStatusMap[task.status]}</span>
          </button>
        ) : (
          <div />
        )}

        {nextStatusMap[task.status] && (
          <button
            onClick={() => onMoveStatus(task, nextStatusMap[task.status])}
            title={`Move forward to ${nextStatusMap[task.status]}`}
            className="flex items-center gap-0.5 text-[10px] font-semibold text-indigo-600 hover:text-indigo-700 px-1.5 py-0.5 rounded hover:bg-indigo-50"
          >
            <span>{nextStatusMap[task.status]}</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
