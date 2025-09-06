// Shared TypeScript definitions for both frontend and backend

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Assignment {
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

export interface AssignmentExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  input: any;
  output: any;
  isPublic: boolean;
}

export interface Submission {
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

export interface ExecutionResult {
  passed: boolean;
  score: number;
  message: string;
  executionTime: number;
  testResults: Array<{
    passed: boolean;
    input: string;
    expected: string;
    actual: string;
  }>;
}

export interface LiveClass {
  id: string;
  title: string;
  description?: string;
  schedule: string;
  duration: number;
  meetingUrl?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  participants?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  category: string;
  thumbnail: string;
  students: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string;
  points: number;
  requirements: string[];
}

export interface UserProgress {
  userId: string;
  courseId: string;
  progress: number;
  completedLessons: string[];
  totalTimeSpent: number;
  lastAccessed: string;
}

export interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'system' | 'code';
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 3D Scene types
export interface Scene3DProps {
  userRole: User['role'];
  userData?: User;
  interactive?: boolean;
}

export interface Model3DProps {
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  onClick?: () => void;
  hovered?: boolean;
}