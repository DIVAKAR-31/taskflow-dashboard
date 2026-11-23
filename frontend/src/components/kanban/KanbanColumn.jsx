import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const KanbanColumn = ({
  status,
  title,
  tasks = [],
  color = 'indigo',
  onAddTask,
  onEditTask,
  onDeleteTask,
  onMoveStatus,
  onDropTask,
  draggedTask,
  setDraggedTask,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const columnThemes = {
    'To Do': {
      indicator: 'bg-slate-400',
      badge: 'bg-slate-100 text-slate-700',
      border: 'border-slate-200',
    },
    'In Progress': {
      indicator: 'bg-blue-500',
      badge: 'bg-blue-50 text-blue-700',
      border: 'border-blue-200',
    },
    Completed: {
      indicator: 'bg-emerald-500',
      badge: 'bg-emerald-50 text-emerald-700',
      border: 'border-emerald-200',
    },
  };

  const theme = columnThemes[status] || columnThemes['To Do'];

  // Handle Drag Over
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    // Only remove highlight if actually leaving column container
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (draggedTask) {
      onDropTask(draggedTask, status);
      setDraggedTask(null);
    }
  };

  const handleCardDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.setData('text/plain', task._id);
    e.currentTarget.classList.add('dragging');
  };

  const handleCardDragEnd = (e) => {
    e.currentTarget.classList.remove('dragging');
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex flex-col flex-1 min-w-[280px] max-w-full bg-slate-100/70 rounded-2xl p-4 border transition-all duration-200 ${
        isDragOver
          ? 'kanban-drop-zone drag-over ring-2 ring-indigo-500/40 bg-indigo-50/50'
          : 'border-slate-200/80'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${theme.indicator}`} />
          <h3 className="text-sm font-bold text-slate-800">{title}</h3>
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${theme.badge}`}
          >
            {tasks.length}
          </span>
        </div>

        <button
          onClick={() => onAddTask(status)}
          title={`Add task to ${title}`}
          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-white transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Task Cards Container */}
      <div className="flex-1 space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] min-h-[160px] pr-0.5">
        {tasks.map((task) => (
          <TaskCard
            key={task._id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
            onMoveStatus={onMoveStatus}
            onDragStart={handleCardDragStart}
            onDragEnd={handleCardDragEnd}
          />
        ))}

        {tasks.length === 0 && (
          <div
            onClick={() => onAddTask(status)}
            className="h-32 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-slate-400 hover:border-indigo-300 hover:text-indigo-500 hover:bg-white/40 cursor-pointer transition-colors p-4 text-center"
          >
            <Plus className="w-5 h-5 mb-1 opacity-60" />
            <p className="text-xs font-medium">No tasks yet</p>
            <span className="text-[10px] opacity-75">Click or drag here</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
