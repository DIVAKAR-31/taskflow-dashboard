import React, { createContext, useContext, useState, useCallback } from 'react';
import axiosInstance from '../api/axiosInstance';

const ProjectContext = createContext();

export const ProjectProvider = ({ children }) => {
  const [projects, setProjects] = useState([]);
  const [currentProject, setCurrentProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Dashboard Stats
  const fetchDashboardStats = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/dashboard/stats');
      setStats(res.data.stats);
      setError(null);
      return res.data.stats;
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err.response?.data?.message || 'Failed to fetch dashboard metrics');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch all projects (with optional filters)
  const fetchProjects = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status && filters.status !== 'All') params.append('status', filters.status);
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);

      const res = await axiosInstance.get(`/projects?${params.toString()}`);
      setProjects(res.data.projects);
      setError(null);
      return res.data.projects;
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.response?.data?.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch single project by ID
  const fetchProjectById = useCallback(async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/projects/${id}`);
      setCurrentProject(res.data.project);
      setError(null);
      return res.data.project;
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.response?.data?.message || 'Failed to load project details');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Project (Admin)
  const createProject = async (projectData) => {
    try {
      const res = await axiosInstance.post('/projects', projectData);
      setProjects((prev) => [res.data.project, ...prev]);
      return { success: true, project: res.data.project };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create project';
      return { success: false, message: msg };
    }
  };

  // Update Project
  const updateProject = async (id, projectData) => {
    try {
      const res = await axiosInstance.put(`/projects/${id}`, projectData);
      setProjects((prev) =>
        prev.map((p) => (p._id === id ? { ...p, ...res.data.project } : p))
      );
      if (currentProject && currentProject._id === id) {
        setCurrentProject((prev) => ({ ...prev, ...res.data.project }));
      }
      return { success: true, project: res.data.project };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update project',
      };
    }
  };

  // Delete Project (Admin)
  const deleteProject = async (id) => {
    try {
      await axiosInstance.delete(`/projects/${id}`);
      setProjects((prev) => prev.filter((p) => p._id !== id));
      if (currentProject && currentProject._id === id) {
        setCurrentProject(null);
      }
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete project',
      };
    }
  };

  // Fetch project tasks for Kanban
  const fetchProjectTasks = useCallback(async (projectId) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/projects/${projectId}/tasks`);
      setTasks(res.data.tasks);
      setError(null);
      return res.data.tasks;
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.response?.data?.message || 'Failed to load project tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create Task
  const createTask = async (projectId, taskData) => {
    try {
      const res = await axiosInstance.post(`/projects/${projectId}/tasks`, taskData);
      setTasks((prev) => [...prev, res.data.task]);
      return { success: true, task: res.data.task };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to create task',
      };
    }
  };

  // Update Task
  const updateTask = async (taskId, taskData) => {
    try {
      const res = await axiosInstance.put(`/tasks/${taskId}`, taskData);
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      return { success: true, task: res.data.task };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update task',
      };
    }
  };

  // Move Task Status (Kanban Drag and Drop or Quick Move)
  const updateTaskStatus = async (taskId, newStatus, newOrder = 0) => {
    // Optimistic UI Update: update state immediately for instantaneous response
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) =>
        t._id === taskId ? { ...t, status: newStatus, order: newOrder } : t
      )
    );

    try {
      const res = await axiosInstance.patch(`/tasks/${taskId}/status`, {
        status: newStatus,
        order: newOrder,
      });
      // Replace with server populated task
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? res.data.task : t))
      );
      return { success: true, task: res.data.task };
    } catch (err) {
      // Revert if network error
      setTasks(previousTasks);
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to update task position',
      };
    }
  };

  // Delete Task
  const deleteTask = async (taskId) => {
    try {
      await axiosInstance.delete(`/tasks/${taskId}`);
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || 'Failed to delete task',
      };
    }
  };

  // Fetch all users for assignment
  const fetchUsers = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/users');
      setUsers(res.data.users);
      return res.data.users;
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  }, []);

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        tasks,
        stats,
        users,
        loading,
        error,
        fetchDashboardStats,
        fetchProjects,
        fetchProjectById,
        createProject,
        updateProject,
        deleteProject,
        fetchProjectTasks,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        fetchUsers,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjects = () => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
};
