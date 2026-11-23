const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

// @desc    Get dashboard metrics & statistics
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res, next) => {
  try {
    let projectFilter = {};

    // For Member role, calculate stats based on projects the user is involved in
    if (req.user.role !== 'Admin') {
      projectFilter = {
        $or: [{ owner: req.user._id }, { members: req.user._id }],
      };
    }

    const userProjects = await Project.find(projectFilter).select('_id name category status priority');
    const projectIds = userProjects.map((p) => p._id);

    let taskFilter = { project: { $in: projectIds } };

    // Query aggregates
    const totalProjects = userProjects.length;
    const totalTasks = await Task.countDocuments(taskFilter);
    const completedTasks = await Task.countDocuments({
      ...taskFilter,
      status: 'Completed',
    });
    const inProgressTasks = await Task.countDocuments({
      ...taskFilter,
      status: 'In Progress',
    });
    const todoTasks = await Task.countDocuments({
      ...taskFilter,
      status: 'To Do',
    });
    const pendingTasks = inProgressTasks + todoTasks;

    const overallProgress =
      totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    // Priority breakdown
    const highPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: 'High',
    });
    const mediumPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: 'Medium',
    });
    const lowPriorityTasks = await Task.countDocuments({
      ...taskFilter,
      priority: 'Low',
    });

    // Recent Activities (latest 10)
    let activityFilter = {};
    if (req.user.role !== 'Admin') {
      activityFilter = {
        $or: [{ project: { $in: projectIds } }, { user: req.user._id }],
      };
    }

    const recentActivities = await Activity.find(activityFilter)
      .populate('user', 'name email avatar role')
      .populate('project', 'name')
      .populate('task', 'title')
      .sort({ createdAt: -1 })
      .limit(10);

    // Project progress breakdown (top 5 active projects)
    const projectsProgress = await Promise.all(
      userProjects.slice(0, 5).map(async (project) => {
        const pTasks = await Task.countDocuments({ project: project._id });
        const pCompleted = await Task.countDocuments({
          project: project._id,
          status: 'Completed',
        });
        const pct = pTasks === 0 ? 0 : Math.round((pCompleted / pTasks) * 100);
        return {
          id: project._id,
          name: project.name,
          category: project.category,
          status: project.status,
          totalTasks: pTasks,
          completedTasks: pCompleted,
          percentage: pct,
        };
      })
    );

    res.status(200).json({
      success: true,
      stats: {
        totalProjects,
        totalTasks,
        completedTasks,
        pendingTasks,
        todoTasks,
        inProgressTasks,
        overallProgress,
        priorityBreakdown: {
          high: highPriorityTasks,
          medium: mediumPriorityTasks,
          low: lowPriorityTasks,
        },
        projectsProgress,
        recentActivities,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
};
