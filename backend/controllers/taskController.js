const Task = require('../models/Task');
const Project = require('../models/Project');
const Activity = require('../models/Activity');

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
const getProjectTasks = async (req, res, next) => {
  try {
    const { projectId } = req.params;

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role check: Admin or member of project
    if (req.user.role !== 'Admin') {
      const isMember = project.members.some(
        (m) => m.toString() === req.user._id.toString()
      );
      const isOwner = project.owner.toString() === req.user._id.toString();
      if (!isMember && !isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view tasks for this project',
        });
      }
    }

    const tasks = await Task.find({ project: projectId })
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar')
      .sort({ order: 1, createdAt: 1 });

    res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task in a project
// @route   POST /api/projects/:projectId/tasks
// @access  Private (Admin or Member of Project)
const createTask = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const { title, description, assignedTo, status, priority, dueDate, tags } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Authorization
    if (req.user.role !== 'Admin') {
      const isMember = project.members.some(
        (m) => m.toString() === req.user._id.toString()
      );
      const isOwner = project.owner.toString() === req.user._id.toString();
      if (!isMember && !isOwner) {
        return res.status(403).json({
          success: false,
          message: 'Only project members or admins can add tasks',
        });
      }
    }

    // Calculate order for column
    const taskCountInStatus = await Task.countDocuments({
      project: projectId,
      status: status || 'To Do',
    });

    const task = await Task.create({
      title,
      description: description || '',
      project: projectId,
      assignedTo: assignedTo || null,
      status: status || 'To Do',
      priority: priority || 'Medium',
      dueDate: dueDate || null,
      order: taskCountInStatus,
      createdBy: req.user._id,
      tags: Array.isArray(tags) ? tags : [],
    });

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    await Activity.create({
      user: req.user._id,
      project: projectId,
      task: task._id,
      action: 'Created Task',
      details: `${req.user.name} created task "${task.title}"`,
    });

    res.status(201).json({
      success: true,
      task: populatedTask,
      message: 'Task created successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task details
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // Role check: Admin can update anything. Member can update if assigned to task, creator, or project member.
    if (req.user.role !== 'Admin') {
      const isAssigned =
        task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
      const isCreator = task.createdBy.toString() === req.user._id.toString();
      const isMember = project.members.some(
        (m) => m.toString() === req.user._id.toString()
      );
      if (!isAssigned && !isCreator && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to edit this task',
        });
      }
    }

    const { title, description, assignedTo, status, priority, dueDate, tags, order } = req.body;

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo ? assignedTo : null;
    if (priority) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? dueDate : null;
    if (tags !== undefined && Array.isArray(tags)) task.tags = tags;
    if (order !== undefined) task.order = order;

    const oldStatus = task.status;
    if (status && status !== oldStatus) {
      task.status = status;
      await Activity.create({
        user: req.user._id,
        project: task.project,
        task: task._id,
        action: 'Status Changed',
        details: `${req.user.name} changed "${task.title}" from ${oldStatus} to ${status}`,
      });
    }

    await task.save();

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: 'Task updated successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status & position (Drag and Drop in Kanban)
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateTaskStatus = async (req, res, next) => {
  try {
    const { status, order } = req.body;

    if (!status || !['To Do', 'In Progress', 'Completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status is required (To Do, In Progress, Completed)',
      });
    }

    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const prevStatus = task.status;
    task.status = status;
    if (order !== undefined) {
      task.order = order;
    }

    await task.save();

    // Log activity if status changed
    if (prevStatus !== status) {
      await Activity.create({
        user: req.user._id,
        project: task.project,
        task: task._id,
        action: 'Status Changed',
        details: `${req.user.name} moved "${task.title}" to ${status}`,
      });
    }

    const updatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email avatar role title')
      .populate('createdBy', 'name email avatar');

    res.status(200).json({
      success: true,
      task: updatedTask,
      message: `Task moved to ${status}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin, Task Creator, or Project Owner)
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    const project = await Project.findById(task.project);

    // Permission check
    const isOwner = project && project.owner.toString() === req.user._id.toString();
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (req.user.role !== 'Admin' && !isOwner && !isCreator) {
      return res.status(403).json({
        success: false,
        message: 'Only Administrators or the task creator can delete tasks',
      });
    }

    const taskTitle = task.title;
    const projectId = task.project;

    await task.deleteOne();

    await Activity.create({
      user: req.user._id,
      project: projectId,
      action: 'Deleted Task',
      details: `${req.user.name} deleted task "${taskTitle}"`,
    });

    res.status(200).json({
      success: true,
      message: `Task "${taskTitle}" successfully deleted`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjectTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
