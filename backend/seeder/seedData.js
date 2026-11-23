const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('../config/db');
const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');
const Activity = require('../models/Activity');

dotenv.config();

const seed = async () => {
  try {
    await connectDB();

    console.log('🧹 Clearing previous collections...');
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    await Activity.deleteMany({});

    console.log('👤 Creating users...');
    const adminUser = await User.create({
      name: 'Alex Johnson',
      email: 'admin@taskflow.com',
      password: 'admin123',
      role: 'Admin',
      title: 'Lead Architect & Project Manager',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });

    const memberUser1 = await User.create({
      name: 'Sarah Chen',
      email: 'sarah@taskflow.com',
      password: 'member123',
      role: 'Member',
      title: 'Senior Frontend Developer',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    });

    const memberUser2 = await User.create({
      name: 'David Miller',
      email: 'david@taskflow.com',
      password: 'member123',
      role: 'Member',
      title: 'Backend & Cloud Engineer',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    });

    const memberUser3 = await User.create({
      name: 'Elena Rostova',
      email: 'elena@taskflow.com',
      password: 'member123',
      role: 'Member',
      title: 'UI/UX Designer',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    });

    console.log('📁 Creating projects...');
    const project1 = await Project.create({
      name: 'TaskFlow SaaS Platform 2.0',
      description: 'Next-generation project management dashboard with real-time drag-and-drop Kanban, analytics, and team collaboration.',
      category: 'Web Development',
      status: 'In Progress',
      priority: 'High',
      owner: adminUser._id,
      members: [adminUser._id, memberUser1._id, memberUser2._id, memberUser3._id],
      startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
    });

    const project2 = await Project.create({
      name: 'Mobile App Experience (iOS & Android)',
      description: 'Design and build cross-platform mobile client for on-the-go sprint updates and notifications.',
      category: 'Mobile App',
      status: 'Planning',
      priority: 'Medium',
      owner: adminUser._id,
      members: [adminUser._id, memberUser1._id, memberUser3._id],
      startDate: new Date(),
      endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    });

    const project3 = await Project.create({
      name: 'DevOps & CI/CD Pipeline Modernization',
      description: 'Implement automated testing, Docker containers, and Render/Vercel continuous deployment workflows.',
      category: 'DevOps',
      status: 'In Progress',
      priority: 'High',
      owner: adminUser._id,
      members: [adminUser._id, memberUser2._id],
      startDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
    });

    console.log('📋 Creating Kanban tasks for Project 1...');
    // Tasks for Project 1 (TaskFlow SaaS Platform)
    // To Do
    await Task.create({
      title: 'Design Dark Mode Design System',
      description: 'Create tokens and color palettes for seamless dark/light theme switching in Tailwind CSS.',
      project: project1._id,
      assignedTo: memberUser3._id,
      status: 'To Do',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      order: 0,
      createdBy: adminUser._id,
      tags: ['Design', 'UI', 'Theme'],
    });

    await Task.create({
      title: 'Implement Notification Center API',
      description: 'Add WebSocket or polling endpoint for instant task assignment notifications.',
      project: project1._id,
      assignedTo: memberUser2._id,
      status: 'To Do',
      priority: 'High',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      order: 1,
      createdBy: adminUser._id,
      tags: ['Backend', 'API', 'Realtime'],
    });

    // In Progress
    await Task.create({
      title: 'Kanban Drag and Drop Interactions',
      description: 'Enhance drag-and-drop board with smooth animations, column highlighting, and automatic backend sync.',
      project: project1._id,
      assignedTo: memberUser1._id,
      status: 'In Progress',
      priority: 'High',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      order: 0,
      createdBy: adminUser._id,
      tags: ['Frontend', 'Kanban', 'React'],
    });

    await Task.create({
      title: 'Dashboard Metrics & Activity Feed',
      description: 'Aggregate project completion rates, priority distributions, and dynamic activity timelines.',
      project: project1._id,
      assignedTo: memberUser2._id,
      status: 'In Progress',
      priority: 'Medium',
      dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      order: 1,
      createdBy: adminUser._id,
      tags: ['Dashboard', 'Analytics'],
    });

    // Completed
    await Task.create({
      title: 'JWT Authentication & Role Middleware',
      description: 'Implement bcrypt password hashing, JWT generation, and Admin vs Member authorization checks.',
      project: project1._id,
      assignedTo: adminUser._id,
      status: 'Completed',
      priority: 'High',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      order: 0,
      createdBy: adminUser._id,
      tags: ['Security', 'Auth', 'JWT'],
    });

    await Task.create({
      title: 'MongoDB Schema Architecture',
      description: 'Design User, Project, Task, and Activity models with virtual fields and index optimizations.',
      project: project1._id,
      assignedTo: adminUser._id,
      status: 'Completed',
      priority: 'High',
      dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      order: 1,
      createdBy: adminUser._id,
      tags: ['Database', 'Mongoose'],
    });

    console.log('⚡ Creating initial activities...');
    await Activity.create([
      {
        user: adminUser._id,
        project: project1._id,
        action: 'Created Project',
        details: 'Alex Johnson initialized "TaskFlow SaaS Platform 2.0"',
      },
      {
        user: adminUser._id,
        project: project1._id,
        action: 'Status Changed',
        details: 'Moved "JWT Authentication & Role Middleware" to Completed',
      },
      {
        user: memberUser1._id,
        project: project1._id,
        action: 'Status Changed',
        details: 'Sarah Chen moved "Kanban Drag and Drop Interactions" to In Progress',
      },
      {
        user: adminUser._id,
        project: project2._id,
        action: 'Created Project',
        details: 'Alex Johnson created "Mobile App Experience (iOS & Android)"',
      },
      {
        user: adminUser._id,
        project: project3._id,
        action: 'Created Project',
        details: 'Alex Johnson configured "DevOps & CI/CD Pipeline Modernization"',
      },
    ]);

    console.log(' Seed completed successfully!');
    console.log('--------------------------------------------------');
    console.log(' Demo Accounts Created:');
    console.log('   Admin:  admin@taskflow.com  / Password: admin123');
    console.log('   Member: sarah@taskflow.com  / Password: member123');
    console.log('   Member: david@taskflow.com  / Password: member123');
    console.log('--------------------------------------------------');

    return true;
  } catch (error) {
    console.error('❌ Seeder error:', error);
    throw error;
  }
};

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seed;
