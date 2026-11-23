import React, { useState, useEffect } from 'react';
import Modal from '../common/Modal';
import { useProjects } from '../../context/ProjectContext';

const ProjectModal = ({ isOpen, onClose, projectToEdit }) => {
  const { createProject, updateProject, users, fetchUsers } = useProjects();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Web Development',
    status: 'In Progress',
    priority: 'Medium',
    members: [],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (projectToEdit) {
      setFormData({
        name: projectToEdit.name || '',
        description: projectToEdit.description || '',
        category: projectToEdit.category || 'Web Development',
        status: projectToEdit.status || 'In Progress',
        priority: projectToEdit.priority || 'Medium',
        members: projectToEdit.members
          ? projectToEdit.members.map((m) => (typeof m === 'object' ? m._id : m))
          : [],
        startDate: projectToEdit.startDate
          ? new Date(projectToEdit.startDate).toISOString().split('T')[0]
          : '',
        endDate: projectToEdit.endDate
          ? new Date(projectToEdit.endDate).toISOString().split('T')[0]
          : '',
      });
    } else {
      setFormData({
        name: '',
        description: '',
        category: 'Web Development',
        status: 'In Progress',
        priority: 'Medium',
        members: [],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
      });
    }
    setErrorMsg('');
  }, [projectToEdit, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMsg('Please enter a project name.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    let res;
    if (projectToEdit) {
      res = await updateProject(projectToEdit._id, formData);
    } else {
      res = await createProject(formData);
    }

    setLoading(false);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.message);
    }
  };

  const toggleMember = (userId) => {
    setFormData((prev) => {
      const exists = prev.members.includes(userId);
      return {
        ...prev,
        members: exists
          ? prev.members.filter((id) => id !== userId)
          : [...prev.members, userId],
      };
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={projectToEdit ? 'Edit Project Details' : 'Create New Project'}
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMsg && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
            {errorMsg}
          </div>
        )}

        {/* Project Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Project Title *
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Mobile Banking App v2"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Description
          </label>
          <textarea
            rows="3"
            placeholder="Outline goals, architecture, or deliverables..."
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Category & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Web Development">Web Development</option>
              <option value="Mobile App">Mobile App</option>
              <option value="Design & UI/UX">Design & UI/UX</option>
              <option value="Marketing">Marketing</option>
              <option value="DevOps">DevOps</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Planning">Planning</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="On Hold">On Hold</option>
            </select>
          </div>
        </div>

        {/* Priority & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Priority
            </label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) =>
                setFormData({ ...formData, endDate: e.target.value })
              }
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Team Members Assignment */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Assign Team Members
          </label>
          <div className="max-h-36 overflow-y-auto border border-slate-200 rounded-lg p-2 space-y-1 bg-slate-50/50">
            {users.length === 0 ? (
              <p className="text-xs text-slate-400 p-2">No users found.</p>
            ) : (
              users.map((u) => {
                const isSelected = formData.members.includes(u._id);
                return (
                  <div
                    key={u._id}
                    onClick={() => toggleMember(u._id)}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/60'
                        : 'hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={
                          u.avatar ||
                          `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
                            u.name
                          )}`
                        }
                        alt={u.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span>{u.name}</span>
                      <span className="text-[10px] text-slate-400">({u.role})</span>
                    </div>
                    <span className="text-xs font-bold">
                      {isSelected ? '✓' : '+'}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-soft-sm transition-colors disabled:opacity-50"
          >
            {loading
              ? 'Saving...'
              : projectToEdit
              ? 'Update Project'
              : 'Create Project'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProjectModal;
