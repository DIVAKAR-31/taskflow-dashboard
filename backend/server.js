const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');
const User = require('./models/User');
const seed = require('./seeder/seedData');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration
app.use(
  cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Logging in dev environment
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TaskFlow API Server',
    environment: process.env.NODE_ENV || 'development',
  });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// 404 & Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Await database connection before opening port
    await connectDB();

    // Auto-seed if database is empty (e.g. fresh memory server or fresh Atlas db)
    const userCount = await User.countDocuments({});
    if (userCount === 0) {
      console.log('🌱 No users found in database. Auto-seeding initial demo data...');
      try {
        await seed();
        console.log('✅ Auto-seed completed successfully!');
      } catch (seedErr) {
        console.error('⚠️ Auto-seed failed:', seedErr.message);
      }
    }

    const server = app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 TaskFlow Backend running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`🌐 Health check available at: http://localhost:${PORT}/api/health`);
    });

    return server;
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

startServer();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
