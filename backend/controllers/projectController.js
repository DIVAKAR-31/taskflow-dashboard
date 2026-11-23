const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get all projects (Admin gets all, Member gets projects they belong to or own)
// @route   GET /api/projects
// @access  Private
const getProjects = async (req, res, next) => {
  try {
    let query = {};

    // If Member role, only show projects where user is owner or member
    if (req.user.role !== 'Admin') {
      query = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    // Optional query filtering
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }
    if (req.query.category && req.query.category !== 'All') {
      query.category = req.query.category;
    }

    const projects = await Project.find(query)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role title')
      .sort({ createdAt: -1 });

    // Attach task count statistics to each project
    const projectsWithStats = await Promise.all(
      projects.map(async (project) => {
        const totalTasks = await Task.countDocuments({ project: project._id });
        const completedTasks = await Task.countDocuments({
          project: project._id,
          status: 'Completed',
        });
        const inProgressTasks = await Task.countDocuments({
          project: project._id,
          status: 'In Progress',
        });
        const todoTasks = await Task.countDocuments({
          project: project._id,
          status: 'To Do',
        });

        const progress =
          totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

        return {
          ...project.toObject(),
          stats: {
            totalTasks,
            completedTasks,
            inProgressTasks,
            todoTasks,
            progress,
          },
        };
      })
    );

    res.status(200).json({
      success: true,
      count: projectsWithStats.length,
      projects: projectsWithStats,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project details
// @route   GET /api/projects/:id
// @access  Private
const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar role title')
      .populate('members', 'name email avatar role title');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Check authorization for Member role
    if (req.user.role !== 'Admin') {
      const isMember = project.members.some(
        (m) => m._id.toString() === req.user._id.toString()
      );
      const isOwner = project.owner._id.toString() === req.user._id.toString();

      if (!isMember && !isOwner) {
        return res.status(403).json({
          success: false,
          message: 'You are not assigned to view this project',
        });
      }
    }

    const totalTasks = await Task.countDocuments({ project: project._id });
    const completedTasks = await Task.countDocuments({
      project: project._id,
      status: 'Completed',
    });
    const inProgressTasks = await Task.countDocuments({
      project: project._id,
      status: 'In Progress',
    });
    const todoTasks = await Task.countDocuments({
      project: project._id,
      status: 'To Do',
    });
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    res.status(200).json({
      success: true,
      project: {
        ...project.toObject(),
        stats: {
          totalTasks,
          completedTasks,
          inProgressTasks,
          todoTasks,
          progress,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin role)
const createProject = async (req, res, next) => {
  try {
    const { name, description, category, status, priority, members, startDate, endDate } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Project name is required',
      });
    }

    // Default owner is the creating user
    const project = await Project.create({
      name,
      description,
      category: category || 'Web Development',
      status: status || 'In Progress',
      priority: priority || 'Medium',
      owner: req.user._id,
      members: Array.isArray(members) ? members : [],
      startDate: startDate || Date.now(),
      endDate: endDate || null,
    });

    const populatedProject = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role title');

    // Record activity
    await Activity.create({
      user: req.user._id,
      project: project._id,
      action: 'Created Project',
      details: `${req.user.name} created project "${project.name}"`,
    });

    res.status(201).json({
      success: true,
      project: {
        ...populatedProject.toObject(),
        stats: {
          totalTasks: 0,
          completedTasks: 0,
          inProgressTasks: 0,
          todoTasks: 0,
          progress: 0,
        },
      },
      message: 'Project successfully created',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin or Project Owner)
const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    // Authorization check: Admin or Project Owner
    if (
      req.user.role !== 'Admin' &&
      project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only Administrators or the Project Owner can edit this project',
      });
    }

    const { name, description, category, status, priority, members, startDate, endDate } = req.body;

    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (category) project.category = category;
    if (status) project.status = status;
    if (priority) project.priority = priority;
    if (members !== undefined && Array.isArray(members)) project.members = members;
    if (startDate) project.startDate = startDate;
    if (endDate !== undefined) project.endDate = endDate;

    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role title');

    await Activity.create({
      user: req.user._id,
      project: project._id,
      action: 'Updated Project',
      details: `${req.user.name} updated project "${project.name}"`,
    });

    res.status(200).json({
      success: true,
      project: updated,
      message: 'Project successfully updated',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin or Project Owner)
const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found',
      });
    }

    if (
      req.user.role !== 'Admin' &&
      project.owner.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Only Administrators can delete projects',
      });
    }

    const projectName = project.name;

    // Delete associated tasks and activities
    await Task.deleteMany({ project: project._id });
    await Activity.deleteMany({ project: project._id });
    await project.deleteOne();

    await Activity.create({
      user: req.user._id,
      action: 'Deleted Project',
      details: `${req.user.name} deleted project "${projectName}"`,
    });

    res.status(200).json({
      success: true,
      message: `Project "${projectName}" and its tasks were permanently deleted`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add member to project
// @route   POST /api/projects/:id/members
// @access  Private (Admin)
const addProjectMember = async (req, res, next) => {
  try {
    const { userId } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    if (project.members.includes(userId)) {
      return res.status(400).json({
        success: false,
        message: 'User is already a member of this project',
      });
    }

    project.members.push(userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role title');

    res.status(200).json({
      success: true,
      project: updated,
      message: 'Member added to project',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove member from project
// @route   DELETE /api/projects/:id/members/:userId
// @access  Private (Admin)
const removeProjectMember = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    const project = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    project.members = project.members.filter((m) => m.toString() !== userId);
    await project.save();

    const updated = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role title');

    res.status(200).json({
      success: true,
      project: updated,
      message: 'Member removed from project',
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember,
};
