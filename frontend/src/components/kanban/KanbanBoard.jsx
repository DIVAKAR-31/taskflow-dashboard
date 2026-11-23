import React, { useState } from 'react';
import KanbanColumn from './KanbanColumn';
import { useProjects } from '../../context/ProjectContext';
import { Search, Filter, Sparkles } from 'lucide-react';

const KanbanBoard = ({
  tasks = [],
  onAddTask,
  onEditTask,
  onDeleteTask,
}) => {
  const { updateTaskStatus } = useProjects();
  const [draggedTask, setDraggedTask] = useState(null);
  const [taskSearch, setTaskSearch] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');

  const filteredTasks = tasks.filter((t) => {
    const matchSearch =
      t.title.toLowerCase().includes(taskSearch.toLowerCase()) ||
      (t.description &&
        t.description.toLowerCase().includes(taskSearch.toLowerCase()));
    const matchPriority =
      priorityFilter === 'All' || t.priority === priorityFilter;
    return matchSearch && matchPriority;
  });

  const todoTasks = filteredTasks.filter((t) => t.status === 'To Do');
  const inProgressTasks = filteredTasks.filter((t) => t.status === 'In Progress');
  const completedTasks = filteredTasks.filter((t) => t.status === 'Completed');

  // Handle Drag & Drop Task Movement
  const handleDropTask = async (task, targetStatus) => {
    if (task.status === targetStatus) return;
    await updateTaskStatus(task._id, targetStatus);
  };

  // Handle Quick Move Action
  const handleMoveStatus = async (task, targetStatus) => {
    if (task.status === targetStatus) return;
    await updateTaskStatus(task._id, targetStatus);
  };

  return (
    <div className="space-y-4">
      {/* Board Controls: Search & Priority Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-soft-sm">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Filter tasks on board..."
            value={taskSearch}
            onChange={(e) => setTaskSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-semibold text-slate-500">Priority:</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Kanban 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
        <KanbanColumn
          status="To Do"
          title="To Do"
          tasks={todoTasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveStatus={handleMoveStatus}
          onDropTask={handleDropTask}
          draggedTask={draggedTask}
          setDraggedTask={setDraggedTask}
        />

        <KanbanColumn
          status="In Progress"
          title="In Progress"
          tasks={inProgressTasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveStatus={handleMoveStatus}
          onDropTask={handleDropTask}
          draggedTask={draggedTask}
          setDraggedTask={setDraggedTask}
        />

        <KanbanColumn
          status="Completed"
          title="Completed"
          tasks={completedTasks}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
          onMoveStatus={handleMoveStatus}
          onDropTask={handleDropTask}
          draggedTask={draggedTask}
          setDraggedTask={setDraggedTask}
        />
      </div>
    </div>
  );
};

export default KanbanBoard;
