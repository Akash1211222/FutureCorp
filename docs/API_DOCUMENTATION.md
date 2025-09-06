# FutureCorp LMS API Documentation

## Base URL
```
Development: http://localhost:5000/api
Production: https://api.futurecorp-lms.com/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Response Format
All API responses follow this structure:
```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user account.

**Request Body:**
```typescript
{
  name: string;
  email: string;
  password: string;
  role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    accessToken: string;
  };
  message: "User registered successfully";
}
```

#### POST /auth/login
Authenticate user and receive access token.

**Request Body:**
```typescript
{
  email: string;
  password: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    user: User;
    accessToken: string;
  };
  message: "Login successful";
}
```

#### GET /auth/me
Get current user profile (requires authentication).

**Response:**
```typescript
{
  success: true;
  data: User;
}
```

### Users

#### GET /users
Get all users (Admin/Teacher only).

**Query Parameters:**
- `role`: Filter by user role
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response:**
```typescript
{
  success: true;
  data: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### GET /users/students
Get all students (Teacher/Admin only).

#### GET /users/:id/stats
Get user statistics and progress.

**Response:**
```typescript
{
  success: true;
  data: {
    totalSubmissions: number;
    averageScore: number;
    completedCourses: number;
    studyHours: number;
    achievements: Achievement[];
    recentActivity: Activity[];
  };
}
```

### Assignments

#### GET /assignments
Get all assignments.

**Query Parameters:**
- `difficulty`: Filter by difficulty
- `category`: Filter by category
- `page`: Page number
- `limit`: Items per page

#### POST /assignments
Create new assignment (Teacher/Admin only).

**Request Body:**
```typescript
{
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  examples: AssignmentExample[];
  constraints: string[];
  testCases: TestCase[];
  points: number;
  dueDate?: string;
}
```

#### GET /assignments/:id
Get specific assignment details.

#### POST /assignments/submit
Submit solution for assignment.

**Request Body:**
```typescript
{
  assignmentId: string;
  code: string;
}
```

**Response:**
```typescript
{
  success: true;
  data: {
    submission: Submission;
    result: ExecutionResult;
  };
  message: "Solution submitted successfully";
}
```

### Live Classes

#### GET /classes
Get all live classes.

#### POST /classes
Create new live class (Teacher/Admin only).

**Request Body:**
```typescript
{
  title: string;
  description?: string;
  schedule: string; // ISO date string
  duration: number; // minutes
  course?: string;
}
```

#### POST /classes/:id/join
Join a live class.

#### POST /classes/:id/start
Start a live class (Teacher/Admin only).

### Courses

#### GET /courses
Get all courses.

#### POST /courses
Create new course (Teacher/Admin only).

**Request Body:**
```typescript
{
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail?: string;
}
```

## WebSocket Events

### Connection
```typescript
// Client connects
socket.connect();

// Server acknowledges
socket.emit('connected', { socketId: string });
```

### Live Classes
```typescript
// Join class room
socket.emit('join-class', classId);

// Leave class room
socket.emit('leave-class', classId);

// Send chat message
socket.emit('chat-message', {
  classId: string;
  message: string;
  user: User;
});

// Receive chat message
socket.on('chat-message', {
  id: string;
  message: string;
  user: User;
  timestamp: string;
});
```

### Code Collaboration
```typescript
// Send code changes
socket.emit('code-change', {
  assignmentId: string;
  code: string;
});

// Receive code updates
socket.on('code-update', {
  assignmentId: string;
  code: string;
});
```

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input data |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Resource already exists |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Rate Limiting

### Default Limits
- General API: 100 requests per 15 minutes per IP
- Authentication: 5 requests per 15 minutes per IP
- File uploads: 10 requests per hour per user
- Code execution: 30 requests per hour per user

### Headers
Rate limit information is included in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Assignment
```typescript
interface Assignment {
  id: string;
  title: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  examples: AssignmentExample[];
  constraints: string[];
  testCases: TestCase[];
  points: number;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Submission
```typescript
interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  code: string;
  result?: ExecutionResult;
  score?: number;
  status: 'pending' | 'passed' | 'failed';
  createdAt: string;
  updatedAt: string;
}
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
VITE_SOCKET_URL=http://localhost:5000
```