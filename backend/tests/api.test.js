/**
 * TaskFlow Automated Test Suite
 * Tests Auth, JWT, Projects, Kanban Tasks, Dashboard, and Role-Based Access Controls
 */
const http = require('http');
const connectDB = require('../config/db');
const app = require('../server');

const PORT = 5001; // Separate port for tests

let server;
let adminToken = '';
let memberToken = '';
let createdProjectId = '';
let createdTaskId = '';

// Helper for making HTTP requests
function request(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(
      {
        hostname: 'localhost',
        port: PORT,
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      },
      (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          try {
            const parsed = body ? JSON.parse(body) : {};
            resolve({ status: res.statusCode, data: parsed });
          } catch (e) {
            resolve({ status: res.statusCode, raw: body });
          }
        });
      }
    );

    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 Starting TaskFlow Backend Test Suite...\n');

  try {
    server = app.listen(PORT);
    // Wait brief moment for server to listen
    await new Promise((r) => setTimeout(r, 1000));

    // Test 1: Health Check
    console.log('🔹 Test 1: GET /api/health');
    const health = await request({ path: '/api/health', method: 'GET' });
    if (health.status !== 200 || health.data.status !== 'healthy') {
      throw new Error(`Health check failed: ${JSON.stringify(health)}`);
    }
    console.log('   Health check passed!');

    // Test 2: Register Admin
    console.log('\n🔹 Test 2: POST /api/auth/register (Admin)');
    const adminReg = await request(
      { path: '/api/auth/register', method: 'POST' },
      {
        name: 'Automated Admin',
        email: `auto_admin_${Date.now()}@taskflow.com`,
        password: 'password123',
        role: 'Admin',
      }
    );
    if (adminReg.status !== 201 || !adminReg.data.token) {
      throw new Error(`Admin registration failed: ${JSON.stringify(adminReg)}`);
    }
    adminToken = adminReg.data.token;
    console.log('   Admin registered successfully, JWT token acquired!');

    // Test 3: Register Member
    console.log('\n🔹 Test 3: POST /api/auth/register (Member)');
    const memberReg = await request(
      { path: '/api/auth/register', method: 'POST' },
      {
        name: 'Automated Member',
        email: `auto_member_${Date.now()}@taskflow.com`,
        password: 'password123',
        role: 'Member',
      }
    );
    if (memberReg.status !== 201 || !memberReg.data.token) {
      throw new Error(`Member registration failed: ${JSON.stringify(memberReg)}`);
    }
    memberToken = memberReg.data.token;
    console.log('   Member registered successfully!');

    // Test 4: Create Project as Admin
    console.log('\n🔹 Test 4: POST /api/projects (Admin create project)');
    const projRes = await request(
      {
        path: '/api/projects',
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      {
        name: 'E2E Testing Project',
        description: 'Automated integration testing project',
        category: 'Web Development',
        priority: 'High',
      }
    );
    if (projRes.status !== 201 || !projRes.data.project?._id) {
      throw new Error(`Project creation failed: ${JSON.stringify(projRes)}`);
    }
    createdProjectId = projRes.data.project._id;
    console.log(`   Project created! ID: ${createdProjectId}`);

    // Test 5: Role-based Access - Member cannot create project if restricted to Admin
    console.log('\n🔹 Test 5: Role-based Authorization check (Member cannot create project)');
    const memberProjRes = await request(
      {
        path: '/api/projects',
        method: 'POST',
        headers: { Authorization: `Bearer ${memberToken}` },
      },
      {
        name: 'Unauthorized Project Attempt',
      }
    );
    if (memberProjRes.status !== 403) {
      throw new Error(`RBAC failed! Expected 403, got: ${memberProjRes.status}`);
    }
    console.log('   RBAC correctly blocked non-admin user (403 Forbidden)!');

    // Test 6: Create Kanban Task
    console.log(`\n🔹 Test 6: POST /api/projects/${createdProjectId}/tasks`);
    const taskRes = await request(
      {
        path: `/api/projects/${createdProjectId}/tasks`,
        method: 'POST',
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      {
        title: 'Verify Kanban Drag and Drop Flow',
        description: 'Card must move across To Do -> In Progress -> Completed',
        status: 'To Do',
        priority: 'High',
        tags: ['QA', 'E2E'],
      }
    );
    if (taskRes.status !== 201 || !taskRes.data.task?._id) {
      throw new Error(`Task creation failed: ${JSON.stringify(taskRes)}`);
    }
    createdTaskId = taskRes.data.task._id;
    console.log(`   Task created! ID: ${createdTaskId}, Status: ${taskRes.data.task.status}`);

    // Test 7: Move Task to "In Progress" (Kanban Drag and Drop API)
    console.log(`\n🔹 Test 7: PATCH /api/tasks/${createdTaskId}/status (To Do -> In Progress)`);
    const moveRes = await request(
      {
        path: `/api/tasks/${createdTaskId}/status`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      {
        status: 'In Progress',
        order: 0,
      }
    );
    if (moveRes.status !== 200 || moveRes.data.task.status !== 'In Progress') {
      throw new Error(`Task status move failed: ${JSON.stringify(moveRes)}`);
    }
    console.log('   Task successfully moved to "In Progress"!');

    // Test 8: Move Task to "Completed"
    console.log(`\n🔹 Test 8: PATCH /api/tasks/${createdTaskId}/status (In Progress -> Completed)`);
    const completeRes = await request(
      {
        path: `/api/tasks/${createdTaskId}/status`,
        method: 'PATCH',
        headers: { Authorization: `Bearer ${adminToken}` },
      },
      {
        status: 'Completed',
        order: 0,
      }
    );
    if (completeRes.status !== 200 || completeRes.data.task.status !== 'Completed') {
      throw new Error(`Task complete failed: ${JSON.stringify(completeRes)}`);
    }
    console.log('   Task successfully moved to "Completed"!');

    // Test 9: Dashboard Metrics
    console.log('\n🔹 Test 9: GET /api/dashboard/stats');
    const statsRes = await request({
      path: '/api/dashboard/stats',
      method: 'GET',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (statsRes.status !== 200 || !statsRes.data.stats) {
      throw new Error(`Dashboard stats failed: ${JSON.stringify(statsRes)}`);
    }
    const stats = statsRes.data.stats;
    console.log('   Dashboard Metrics received:');
    console.log(`     - Total Projects: ${stats.totalProjects}`);
    console.log(`     - Total Tasks: ${stats.totalTasks}`);
    console.log(`     - Completed Tasks: ${stats.completedTasks}`);
    console.log(`     - Overall Progress: ${stats.overallProgress}%`);
    console.log(`     - Recent Activities Count: ${stats.recentActivities.length}`);

    console.log('\n🎉 ALL 9 TEST CASES PASSED SUCCESSFULLY!\n');
    server.close(() => process.exit(0));
  } catch (error) {
    console.error('\n Test Failure:', error.message);
    if (server) server.close();
    process.exit(1);
  }
}

runTests();
