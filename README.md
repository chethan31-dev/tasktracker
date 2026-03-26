# Task Management System

A full-stack task management application with authentication, CRUD operations, filtering, and analytics.

## Features

- User authentication (signup/login with JWT)
- Create, read, update, delete tasks
- Filter by status and priority
- Search tasks by title
- Analytics dashboard with completion stats
- Responsive design

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT

## Setup

### Backend

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your_secret_key_here
```

4. Start server:
```bash
npm run dev
```

### Frontend

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

4. Open http://localhost:3000

## API Endpoints

### Auth
- POST /api/auth/signup
- POST /api/auth/login

### Tasks
- POST /api/tasks
- GET /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id
- PATCH /api/tasks/:id/status
- GET /api/tasks/stats

## Requirements

- Node.js 16+
- MongoDB running locally or connection string
