# TaskFlow – Modern Project Management & Kanban Dashboard

A production-ready, full-stack **MERN (MongoDB, Express.js, React.js, Node.js)** project management web application featuring secure JWT authentication, role-based access control (Admin & Member), interactive drag-and-drop Kanban boards, sprint analytics, and real-time MongoDB data persistence.

---

##  Table of Contents
- [Project Overview](#-project-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Environment Variables Setup](#-environment-variables-setup)
- [Local Installation & Setup (Step-by-Step)](#-local-installation--setup-step-by-step)
- [Database Configuration (MongoDB Atlas & Zero-Config Local Dev)](#-database-configuration)
- [Database Seeding (Pre-populated Demo Data)](#-database-seeding)
- [Automated Testing Suite](#-automated-testing-suite)
- [Role-Based Access Control (RBAC) Matrix](#-role-based-access-control-rbac-matrix)
- [API Reference Documentation](#-api-reference-documentation)
- [Cloud Deployment Guide (Vercel & Render)](#-cloud-deployment-guide)

---

## 🚀 Project Overview

**TaskFlow** is designed for modern agile software development and product teams. It replaces disorganized spreadsheets with:
- **Interactive Kanban Boards**: Move cards across **To Do**, **In Progress**, and **Completed** with smooth HTML5 drag-and-drop and instant MongoDB synchronization.
- **Project Portfolios**: Create, edit, and organize multiple projects with categories, priority tags, target deadlines, and assigned contributors.
- **Real-Time Analytics & Audit Logs**: High-level dashboard displaying total projects, total tasks, completion velocity, priority distribution, and live workspace activity logs.
- **Enterprise-Grade Security**: Industry-standard **JSON Web Tokens (JWT)**, salted password hashing via **bcryptjs**, protected API routes, and strict role authorization.

---

## ✨ Key Features

### 1. User Authentication & Security
- **Signup & Login**: Input validation, duplicate email prevention, and error alerts.
- **Password Encryption**: Passwords salted and hashed with `bcryptjs` before storage.
- **JWT Protection**: Secure stateless bearer token authentication stored in `localStorage` with automated Axios request interceptors.
- **Protected Routing**: React Router wrapper guards private workspace pages against unauthorized access.
- **Quick Demo Login**: 1-click credential buttons for instant testing as **Admin** or **Member**.

### 2. Role-Based Access Control (RBAC)
- **Admin**:
  - Create, edit, and delete any project.
  - Add or remove team members from projects.
  - Create, reorder, reassign, and delete any task across all projects.
  - Manage user roles in the Team Directory.
- **Member**:
  - View assigned projects.
  - Create and update tasks within assigned projects.
  - Change task status via Kanban drag-and-drop.
  - Edit task descriptions, deadlines, and priorities.

### 3. Project Management Dashboard
- **Metric Cards**:
  - **Total Projects**: Active workspace initiatives.
  - **Total Tasks**: Aggregate task volume across all boards.
  - **Completed Tasks**: Tasks shipped with completion percentage.
  - **Pending Tasks**: Work currently in **To Do** or **In Progress**.
- **Sprint & Progress Overview**:
  - Workspace velocity progress bar.
  - Priority breakdown (High, Medium, Low).
  - Per-project delivery tracking.
- **Recent Activities Feed**:
  - Real-time audit trail showing who created projects, moved tasks, or updated records with relative timestamps.

### 4. Interactive Kanban Board
- Three distinct columns: **To Do**, **In Progress**, and **Completed**.
- **Drag-and-Drop**: Drag task cards between columns with visual drop target highlighting.
- **Accessibility / Mobile Move**: Next/Previous column quick action buttons on each card.
- **Task Metadata**:
  - Priority badge (Low = Emerald, Medium = Amber, High = Rose).
  - Assignee avatar with initials.
  - Due date badge with overdue warning indicator.
  - Tags and search filter.
- **Persistence**: Every card drag or move instantly updates MongoDB via `PATCH /api/tasks/:id/status`.

---

## 🛠 Technology Stack

### Frontend
- **React.js 18**: Component-based UI with hooks (`useState`, `useEffect`, `useContext`, `useCallback`).
- **Vite 6**: High-performance frontend build tool and dev server.
- **Tailwind CSS 3**: Modern utility-first styling with responsive design and soft shadows.
- **React Router v7**: Client-side routing with nested layouts and route protection.
- **Axios**: HTTP client configured with JWT bearer interceptors and automated 401 redirect handling.
- **Lucide React**: Clean SaaS icon library.

### Backend
- **Node.js**: Cross-platform JavaScript runtime.
- **Express.js**: RESTful API framework with modular controllers and routers.
- **MongoDB & Mongoose**: Object Data Modeling (ODM) for database schema validation, virtual fields, and index optimization.
- **JSON Web Tokens (`jsonwebtoken`)**: Stateless token-based authentication.
- **`bcryptjs`**: Cryptographic password hashing.
- **CORS & Morgan**: Cross-Origin Resource Sharing security and HTTP request logging.

---

## 📁 Folder Structure

```
taskflow/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection & fallback configuration
│   ├── controllers/
│   │   ├── authController.js     # User registration, login & profile
│   │   ├── projectController.js  # Project CRUD & team member assignment
│   │   ├── taskController.js     # Task CRUD & Kanban status moves
│   │   ├── dashboardController.js# Aggregated metrics & activity audit trail
│   │   └── userController.js     # Team directory & role management
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & role authorization
│   │   └── errorMiddleware.js    # 404 & centralized error formatting
│   ├── models/
│   │   ├── User.js               # User schema with bcrypt pre-save hook
│   │   ├── Project.js            # Project schema with tasks virtual populate
│   │   ├── Task.js               # Task schema with priority, status, order
│   │   └── Activity.js           # Activity log schema for audit history
│   ├── routes/
│   │   ├── authRoutes.js         # /api/auth routes
│   │   ├── projectRoutes.js      # /api/projects routes
│   │   ├── taskRoutes.js         # /api/tasks routes
│   │   ├── dashboardRoutes.js    # /api/dashboard routes
│   │   └── userRoutes.js         # /api/users routes
│   ├── seeder/
│   │   └── seedData.js           # Database population script with demo accounts
│   ├── tests/
│   │   └── api.test.js           # Automated end-to-end API test suite
│   ├── .env.example              # Sample backend environment file
│   ├── .env                      # Active backend configuration
│   ├── package.json              # Backend dependencies & npm scripts
│   └── server.js                 # Express server bootstrap & port listener
├── frontend/
│   ├── public/
│   │   └── index.html            # HTML shell with Google Inter font
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js  # Axios with JWT request/response interceptors
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Navbar.jsx        # Sticky top header with role & profile
│   │   │   │   ├── Sidebar.jsx       # Responsive navigation sidebar
│   │   │   │   ├── Modal.jsx         # Accessible backdrop modal dialog
│   │   │   │   ├── Badge.jsx         # Colorful status & priority pill tags
│   │   │   │   ├── StatCard.jsx      # Animated metric card
│   │   │   │   └── ProtectedRoute.jsx# Auth guard component
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsOverview.jsx      # Top 4 summary metric cards
│   │   │   │   ├── ProgressChart.jsx      # Progress bars & priority breakdown
│   │   │   │   ├── RecentActivityList.jsx # Live audit timeline
│   │   │   │   └── QuickActions.jsx       # Fast shortcut trigger buttons
│   │   │   ├── projects/
│   │   │   │   ├── ProjectCard.jsx   # Project tile with progress & team
│   │   │   │   ├── ProjectModal.jsx  # Create / Edit project form
│   │   │   │   └── ProjectFilter.jsx # Search & category dropdowns
│   │   │   └── kanban/
│   │   │       ├── KanbanBoard.jsx   # 3-column drag & drop orchestrator
│   │   │       ├── KanbanColumn.jsx  # Drag-over drop zone & card container
│   │   │       ├── TaskCard.jsx      # Draggable card with actions & badges
│   │   │       └── TaskModal.jsx     # Add / Edit task form
│   │   ├── context/
│   │   │   ├── AuthContext.jsx       # JWT user state & authentication methods
│   │   │   └── ProjectContext.jsx    # Projects, Kanban tasks, & stats state
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Sign in with 1-click demo buttons
│   │   │   ├── Signup.jsx            # Sign up with role selection
│   │   │   ├── Dashboard.jsx         # Analytics & workspace overview
│   │   │   ├── Projects.jsx          # Project directory & board cards
│   │   │   ├── ProjectDetails.jsx    # Single project Kanban sprint board
│   │   │   ├── TeamMembers.jsx       # Team directory & Admin role toggling
│   │   │   └── NotFound.jsx          # 404 page
│   │   ├── App.jsx                   # Route definition & app layout
│   │   ├── index.css                 # Tailwind CSS directives & scrollbars
│   │   └── main.jsx                  # React DOM client entry point
│   ├── .env.example                  # Sample frontend environment file
│   ├── .env                          # Active frontend configuration
│   ├── tailwind.config.js            # Tailwind typography, colors, shadows
│   ├── postcss.config.js             # PostCSS Tailwind plugins
│   ├── vite.config.js                # Vite build & local proxy config
│   └── package.json                  # Frontend dependencies
├── render.yaml                       # Render backend cloud deployment spec
├── vercel.json                       # Vercel frontend cloud deployment spec
├── package.json                      # Root workspace orchestrator scripts
└── README.md                         # Project documentation
```

---

## ⚙️ Environment Variables Setup

### Backend (`backend/.env`)
Create `backend/.env` with the following variables:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority
JWT_SECRET=taskflow_jwt_secret_dev_key_super_secure_2026
JWT_EXPIRES_IN=30d
CLIENT_URL=http://localhost:5173
```
*(If `MONGODB_URI` is omitted during local development, the backend automatically uses an embedded local database for zero-config startup).*

### Frontend (`frontend/.env`)
Create `frontend/.env` with:
```env
# Points to local backend during development
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 💻 Local Installation & Setup (Step-by-Step)

Follow these exact terminal commands:

### Step 1: Clone or Navigate to the Project
```bash
cd "c:\Users\sdiva\OneDrive\Desktop\week 4"
```

### Step 2: Install Backend Dependencies
```bash
npm --prefix backend install
```

### Step 3: Install Frontend Dependencies
```bash
npm --prefix frontend install
```

### Step 4: Populate Seed Data (Projects, Tasks & Demo Users)
```bash
npm --prefix backend run seed
```

### Step 5: Start the Backend Server
```bash
npm --prefix backend run dev
```
*(Backend runs on `http://localhost:5000`)*

### Step 6: Start the Frontend Application (In a new terminal window)
```bash
npm --prefix frontend dev
```
*(Frontend opens at `http://localhost:5173`)*

---

## 🗄️ Database Configuration

### Connecting to MongoDB Atlas
1. Create a free account at [mongodb.com/atlas](https://www.mongodb.com/atlas).
2. Create a free **M0 Shared Cluster**.
3. Under **Database Access**, create a database user (e.g., `taskflow_admin`) with a password.
4. Under **Network Access**, click **Add IP Address** and choose **Allow Access From Anywhere (`0.0.0.0/0`)**.
5. Go to **Clusters** > **Connect** > **Drivers** > **Node.js** and copy your connection string:
   ```text
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/taskflow?retryWrites=true&w=majority
   ```
6. Paste the string into `backend/.env` under `MONGODB_URI`.

---

## 👥 Pre-Populated Demo Accounts

When you run `npm --prefix backend run seed`, the database is populated with realistic projects, Kanban tasks, and these accounts:

| Role | Email | Password | Permissions |
|---|---|---|---|
| **Admin** | `admin@taskflow.com` | `admin123` | Full access: create projects, assign members, manage all tasks, edit user roles. |
| **Member** | `sarah@taskflow.com` | `member123` | View assigned projects, update tasks, drag-and-drop Kanban status. |
| **Member** | `david@taskflow.com` | `member123` | View assigned projects, update tasks, drag-and-drop Kanban status. |

*(The login screen also features 1-click buttons that automatically fill in these credentials for fast testing!)*

---

## 🧪 Automated Testing Suite

TaskFlow includes an automated integration test suite that tests all 9 core flows:
1. API Health Check (`/api/health`)
2. Admin Registration with JWT issuance
3. Member Registration with role assignment
4. Project Creation by Admin
5. Role-Based Access Control verification (blocking unauthorized actions)
6. Kanban Task creation with priority and tags
7. Task status transition from **To Do** to **In Progress**
8. Task status transition from **In Progress** to **Completed**
9. Dashboard metrics calculation and recent activity aggregation

To run the automated test suite:
```bash
npm --prefix backend test
```

---

## 🔒 Role-Based Access Control (RBAC) Matrix

| Feature | Admin | Member | Unauthenticated |
|---|:---:|:---:|:---:|
| View Public Login / Signup |  |  |  |
| View Dashboard & Metrics |  |  (Assigned Projects) | ❌ |
| Create New Projects |  | ❌ | ❌ |
| Edit / Delete Projects |  | ❌ | ❌ |
| View Project Kanban Board |  |  (If Assigned) | ❌ |
| Add Task to Board |  |  | ❌ |
| Drag & Drop Task Between Columns |  |  | ❌ |
| Edit Task Details & Priority |  |  (Assigned or Created) | ❌ |
| Delete Task from Board |  | ❌ | ❌ |
| Manage User Roles (Admin / Member) |  | ❌ | ❌ |

---

## 📡 API Reference Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create new user account.
- `POST /api/auth/login` - Authenticate user & return JWT token.
- `GET /api/auth/me` - Fetch current user session *(Protected)*.
- `PUT /api/auth/profile` - Update user display name or job title *(Protected)*.

### Projects (`/api/projects`)
- `GET /api/projects` - List all projects with task completion counts *(Protected)*.
- `POST /api/projects` - Create a new project *(Admin only)*.
- `GET /api/projects/:id` - Fetch single project with assigned members *(Protected)*.
- `PUT /api/projects/:id` - Update project details *(Admin / Owner)*.
- `DELETE /api/projects/:id` - Delete project and its tasks *(Admin / Owner)*.
- `POST /api/projects/:id/members` - Add member to project *(Admin)*.
- `DELETE /api/projects/:id/members/:userId` - Remove member from project *(Admin)*.

### Tasks (`/api/projects/:projectId/tasks` & `/api/tasks`)
- `GET /api/projects/:projectId/tasks` - Retrieve tasks for a project board *(Protected)*.
- `POST /api/projects/:projectId/tasks` - Create task in column *(Protected)*.
- `PUT /api/tasks/:id` - Update task title, description, priority, or due date *(Protected)*.
- `PATCH /api/tasks/:id/status` - Move card across Kanban columns (**To Do**, **In Progress**, **Completed**) *(Protected)*.
- `DELETE /api/tasks/:id` - Delete task *(Admin or Task Creator)*.

### Dashboard (`/api/dashboard`)
- `GET /api/dashboard/stats` - Fetch total projects, tasks, completion rates, priority breakdown, and recent activities audit trail *(Protected)*.

### Users (`/api/users`)
- `GET /api/users` - List all users for task/project assignment *(Protected)*.
- `PATCH /api/users/:id/role` - Promote or demote user between Admin and Member *(Admin only)*.

---

## 🌐 Cloud Deployment Guide

### 1. Database (MongoDB Atlas)
- Create a free cluster on MongoDB Atlas as detailed in [Database Configuration](#-database-configuration).
- Save the connection URI.

### 2. Backend Deployment (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com) and create a **New Web Service**.
3. Select your repository.
4. Set the following settings:
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. Under **Environment Variables**, add:
   - `NODE_ENV` = `production`
   - `PORT` = `10000`
   - `MONGODB_URI` = `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET` = `<Generate a secure random string>`
   - `JWT_EXPIRES_IN` = `30d`
   - `CLIENT_URL` = `https://<your-frontend-domain>.vercel.app`
6. Click **Deploy Web Service**. Copy the assigned Render URL (e.g., `https://taskflow-api.onrender.com`).

### 3. Frontend Deployment (Vercel)
1. Sign in to [Vercel](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` = `https://taskflow-api.onrender.com/api` (Replace with your Render backend URL)
5. Click **Deploy**. Vercel will build and serve your frontend globally on edge servers!

---

## 💡 Beginner-Friendly Code Architecture Highlights

1. **How JWT Authentication Works**:
   - When a user signs in, the backend creates a signed token containing the user's ID.
   - The token is stored securely in the browser's `localStorage`.
   - On every API call, an **Axios Interceptor** automatically extracts the token and places it in the `Authorization: Bearer <token>` header.
   - If a token expires or is manipulated, the response interceptor automatically clears the session and redirects the browser to `/login`.

2. **How Kanban Drag-and-Drop Works**:
   - Each `TaskCard` has the HTML5 attribute `draggable={true}`.
   - When a user starts dragging, `handleCardDragStart` saves the task reference into `draggedTask`.
   - Each `KanbanColumn` listens to `onDragOver` and `onDrop`.
   - When dropped, `handleDropTask` immediately triggers an **Optimistic UI Update** so the card moves instantaneously without lag, while concurrently dispatching `PATCH /api/tasks/:id/status` to sync the state to MongoDB.

3. **How Role-Based Access Works**:
   - The `User` model defines `role: ['Admin', 'Member']`.
   - The backend `authorize('Admin')` middleware guards sensitive routes like project creation, project deletion, and role reassignment.
   - The frontend `useAuth()` hook provides an `isAdmin` boolean flag that conditionally enables management modals, action menus, and edit buttons.

---

## 📄 License
This project is open-source and available under the MIT License.
