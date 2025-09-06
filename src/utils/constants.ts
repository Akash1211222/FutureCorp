// Application constants
export const APP_CONFIG = {
  name: "FutureCorp's Learning Management System",
  version: "1.0.0",
  author: "FutureCorp",
  description: "Modern learning platform for coding education",
  
  // Performance settings
  cache: {
    defaultTTL: 5 * 60 * 1000, // 5 minutes
    maxSize: 100, // Maximum cached items
  },
  
  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retries: 3,
    retryDelay: 1000, // 1 second
  },
  
  // UI settings
  ui: {
    debounceDelay: 300,
    animationDuration: 300,
    toastDuration: 5000,
  },
  
  // Pagination
  pagination: {
    defaultPageSize: 20,
    maxPageSize: 100,
  },
  
  // File upload
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'video/mp4'],
  },
  
  // Code editor
  editor: {
    maxCodeLength: 10000,
    tabSize: 2,
    fontSize: 14,
  }
} as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  COURSES: '/courses',
  ASSIGNMENTS: '/assignments',
  STUDENTS: '/students',
  CLASSES: '/classes',
  ANALYTICS: '/analytics',
  VIDEOS: '/videos',
  PLAYGROUND: '/playground',
  ADMIN: '/admin',
} as const;

export const USER_ROLES = {
  STUDENT: 'STUDENT',
  TEACHER: 'TEACHER',
  ADMIN: 'ADMIN',
} as const;

export const ASSIGNMENT_DIFFICULTIES = {
  EASY: 'Easy',
  MEDIUM: 'Medium',
  HARD: 'Hard',
} as const;

export const CLASS_STATUSES = {
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;