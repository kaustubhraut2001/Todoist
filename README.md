# Todoist Web Application

A production-ready web version of Todoist, featuring task management, projects, search/filtering, and user authentication. Built with modern technologies and best practices.

## Features

### Core Functionality

- **User Authentication** - Secure JWT-based signup/login/logout
- **Task Management** - Full CRUD operations for tasks
- **Project Organization** - Group tasks into color-coded projects
- **Priority Levels** - 4-level priority system (P1-P4)
- **Due Dates** - Set and track task deadlines
- **Search & Filter** - Real-time search and advanced filtering
- **Task Completion** - Track completed vs active tasks
- **Tags** - Organize tasks with custom tags
- **Responsive Design** - Works on desktop, tablet, and mobile

### Technical Features

- Secure authentication with HTTP-only cookies
- Real-time task statistics
- Modern, clean UI with Tailwind CSS
- Fast, optimized performance
- Full-text search on tasks
- Mobile-responsive sidebar navigation
- Client-side form validation
- Error handling and loading states

## Technology Stack

### Frontend

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Hot Toast** - Notifications
- **Lucide React** - Icons
- **date-fns** - Date formatting

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin support

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6 or higher) - [Download](https://www.mongodb.com/try/download/community) Other option mongo cloud uri
- **npm** or **yarn** - Comes with Node.js

## Installation & Setup

### 1. Clone or Extract the Project

```bash
cd todoist-web
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
cp .env.example .env

# Edit .env file with your configuration
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/todoist
# JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
# NODE_ENV=development
# FRONTEND_URL=http://localhost:5173
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from root)
cd ../frontend

# Install dependencies
npm install

# Create .env file (or copy from .env.example)
cp .env.example .env

# Edit .env file
# VITE_API_URL=http://localhost:5000/api
```

### 4. Start MongoDB

Make sure MongoDB is running on your system (Or you can simply provide the mongo cloud uri):

```bash
# Windows (if installed as service)
# MongoDB should start automatically

# macOS (with Homebrew)
brew services start mongodb-community

# Linux
sudo systemctl start mongod

# Or run manually
mongod --dbpath /path/to/data/directory
```

### 5. Seed the Database (Optional but Recommended)

```bash
# From backend directory
cd backend
npm run seed
```

This will create:

- Demo user (email: `demo@todoist.com`, password: `password123`)
- 3 sample projects
- 8 sample tasks

### 6. Start the Application

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

The backend will start on `http://localhost:5000`

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173`

### 7. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

**Demo Credentials:**

- Email: `demo@todoist.com`
- Password: `password123`

Or create a new account using the signup page.

## Project Structure

```
todoist-web/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── taskController.ts
│   │   │   └── projectController.ts
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.ts
│   │   │   ├── Task.ts
│   │   │   └── Project.ts
│   │   ├── routes/           # API routes
│   │   │   ├── auth.ts
│   │   │   ├── tasks.ts
│   │   │   └── projects.ts
│   │   ├── middleware/       # Custom middleware
│   │   │   ├── authMiddleware.ts
│   │   │   └── errorHandler.ts
│   │   ├── utils/            # Utility functions
│   │   │   └── seed.ts
│   │   └── index.ts          # Entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── TaskCard.tsx
│   │   │   └── TaskForm.tsx
│   │   ├── pages/            # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Signup.tsx
│   │   │   └── Dashboard.tsx
│   │   ├── hooks/            # Custom hooks
│   │   │   ├── useAuth.tsx
│   │   │   ├── useTasks.ts
│   │   │   └── useProjects.ts
│   │   ├── services/         # API services
│   │   │   ├── api.ts
│   │   │   ├── authService.ts
│   │   │   ├── taskService.ts
│   │   │   └── projectService.ts
│   │   ├── types/            # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
└── README.md
```

## 🔌 API Endpoints

### Authentication

- `POST /api/auth/signup` - Create new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### Tasks

- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get single task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/toggle` - Toggle task completion

### Projects

- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get single project
- `POST /api/projects` - Create new project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

## Usage Guide

### Creating a Task

1. Click the "Add Task" button in the header
2. Fill in the task details:
   - Title (required)
   - Description (optional)
   - Priority (P1-P4)
   - Due date (optional)
   - Project (optional)
   - Tags (comma-separated, optional)
3. Click "Create Task"

### Organizing with Projects

1. Click on a project in the sidebar to filter tasks
2. Create new projects by clicking the "+" icon
3. Assign tasks to projects when creating/editing

### Searching and Filtering

- Use the search bar to find tasks by title or description
- Filter by priority using the dropdown
- Toggle between active and completed tasks
- Click "Inbox" to see all tasks

### Completing Tasks

- Click the checkbox next to a task to mark it complete
- Completed tasks are tracked with completion timestamp
- Toggle the "Show Completed" button to view finished tasks

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

The built files will be in `frontend/dist/` directory.
