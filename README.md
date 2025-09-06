# FutureCorp's Learning Management System

A modern learning management system built with React, TypeScript, Node.js, and Supabase.

## Project Structure

```
├── client/          # Frontend React application
│   ├── src/         # React components and utilities
│   ├── public/      # Static assets
│   └── package.json # Frontend dependencies
├── server/          # Backend Node.js API
│   ├── src/         # Server source code
│   ├── prisma/      # Database schema (for reference)
│   └── package.json # Backend dependencies
└── package.json     # Root package.json for scripts
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm run install:all
```

### 2. Environment Configuration

#### Client (.env in client/)
```
VITE_API_URL=http://localhost:5050/api
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

#### Server (.env in server/)
```
DATABASE_URL=your_supabase_database_url
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=http://localhost:5173
PORT=5050
```

### 3. Database Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Run the migration SQL from `supabase/migrations/001_initial_schema.sql` in your Supabase SQL editor
3. Update your environment variables with Supabase credentials

### 4. Run the Application

#### Development (both client and server)
```bash
npm run dev
```

#### Run separately
```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend  
npm run dev:client
```

## Features

- **Role-based Authentication** (Student, Teacher, Admin)
- **Assignment Management** with DSA problems
- **Live Classes** scheduling and management
- **Code Playground** for practice
- **Performance Analytics**
- **Real-time Chat** in live classes
- **Responsive Design** with Tailwind CSS

## Default Credentials

After running the database migration, you can use these test accounts:

- **Admin**: admin@futurecorp.test / Admin@123
- **Teacher**: teacher@futurecorp.test / Teacher@123  
- **Student**: alice@futurecorp.test / Student@123

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- React Router for navigation
- Lucide React for icons

### Backend
- Node.js with Express
- TypeScript
- Supabase PostgreSQL database
- JWT authentication
- Bcrypt for password hashing

### Database
- Supabase PostgreSQL
- Row Level Security (RLS)
- Real-time subscriptions
- Automatic backups