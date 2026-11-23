import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import KanbanBoard from '../components/kanban/KanbanBoard';
import TaskModal from '../components/kanban/TaskModal';
import Badge from '../components/common/Badge';
import {
  ArrowLeft,
  Plus,
  Users,
  Calendar,
  Loader2,
  AlertCircle,
  FolderKanban,
  CheckCircle2,
} from 'lucide-react';

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    currentProject,
    fetchProjectById,
    tasks,
    fetchProjectTasks,
    deleteTask,
    loading,
    error,
  } = useProjects();
  const { user, isAdmin } = useAuth();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [defaultTaskStatus, setDefaultTaskStatus] = useState('To Do');
  const [deleteTaskConfirm, setDeleteTaskConfirm] = useState(null);

  // Load project & tasks
  const loadData = useCallback(async () => {
    if (id) {
      await fetchProjectById(id);
      await fetchProjectTasks(id);
    }
  }, [id, fetchProjectById, fetchProjectTasks]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Open modal to add task in column
  const handleAddTask = (status = 'To Do') => {
    setTaskToEdit(null);
    setDefaultTaskStatus(status);
    setIsTaskModalOpen(true);
  };

  // Open modal to edit existing task
  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setDefaultTaskStatus(task.status);
    setIsTaskModalOpen(true);
  };

  // Delete task prompt
  const handleDeleteTaskPrompt = (task) => {
    setDeleteTaskConfirm(task);
  };

  const handleConfirmDeleteTask = async () => {
    if (!deleteTaskConfirm) return;
    await deleteTask(deleteTaskConfirm._id);
    setDeleteTaskConfirm(null);
  };

  if (loading && !currentProject) {
    return (
      <div className="py-24 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mb-2" />
        <p className="text-xs text-slate-400 font-medium">
          Loading project board...
        </p>
      </div>
    );
  }

  if (error && !currentProject) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-200 text-center max-w-md mx-auto my-12">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <h3 className="text-base font-bold text-slate-900 mb-1">
          Unable to Load Project
        </h3>
        <p className="text-xs text-slate-500 mb-4">{error}</p>
        <button
          onClick={() => navigate('/projects')}
          className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition"
        >
          Return to Projects
        </button>
      </div>
    );
  }

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent =
    tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100);

  return (
    <div className="space-y-6">
      {/* Back button & top navigation */}
      <button
        onClick={() => navigate('/projects')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Project Boards</span>
      </button>

      {/* Project Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-soft-sm">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant={currentProject?.status}>
                {currentProject?.status}
              </Badge>
              <Badge variant={currentProject?.priority}>
                {currentProject?.priority}
              </Badge>
              <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                {currentProject?.category}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {currentProject?.name}
            </h1>

            {currentProject?.description && (
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                {currentProject.description}
              </p>
            )}

            {/* Members & Timeline metadata */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {currentProject?.members?.length || 0} Assigned Members
                </span>
              </div>

              {currentProject?.endDate && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Deadline:{' '}
                    {new Date(currentProject.endDate).toLocaleDateString(
                      'en-US',
                      { month: 'short', day: 'numeric', year: 'numeric' }
                    )}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Progress Circle / Bar & Quick Add Task */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row items-stretch sm:items-center gap-4 border-t lg:border-t-0 pt-4 lg:pt-0">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-200/60 flex items-center justify-center text-indigo-600 font-bold text-xs">
                {progressPercent}%
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800">
                  {completedCount} of {tasks.length} Done
                </p>
                <p className="text-[11px] text-slate-400">Sprint progress</p>
              </div>
            </div>

            <button
              onClick={() => handleAddTask('To Do')}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-soft-sm shadow-indigo-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* Kanban Board Component */}
      <KanbanBoard
        tasks={tasks}
        onAddTask={handleAddTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTaskPrompt}
      />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setTaskToEdit(null);
          loadData();
        }}
        taskToEdit={taskToEdit}
        projectId={id}
        defaultStatus={defaultTaskStatus}
        projectMembers={currentProject?.members}
      />

      {/* Delete Task Confirmation */}
      {deleteTaskConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-slate-100 shadow-soft-xl animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-rose-600 mb-3">
              <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Delete Task</h3>
                <p className="text-[11px] text-slate-500">Permanent action</p>
              </div>
            </div>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Are you sure you want to delete{' '}
              <strong>"{deleteTaskConfirm.title}"</strong>?
            </p>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setDeleteTaskConfirm(null)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDeleteTask}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-soft-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
