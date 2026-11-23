const express = require('express');
const router = express.Router();
const {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
} = require('../controllers/projectController');
const {
  getProjectTasks,
  createTask,
} = require('../controllers/taskController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Nested task routes for a project
router
  .route('/:projectId/tasks')
  .get(protect, getProjectTasks)
  .post(protect, createTask);

// Member management routes
router
  .route('/:id/members')
  .post(protect, authorize('Admin'), addProjectMember);

router
  .route('/:id/members/:userId')
  .delete(protect, authorize('Admin'), removeProjectMember);

// Core project CRUD routes
router
  .route('/')
  .get(protect, getProjects)
  .post(protect, authorize('Admin'), createProject);

router
  .route('/:id')
  .get(protect, getProjectById)
  .put(protect, updateProject)
  .delete(protect, authorize('Admin'), deleteProject);

module.exports = router;
