import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

// Import routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import assignmentRoutes from './routes/assignment.routes.js';
import classRoutes from './routes/class.routes.js';
import courseRoutes from './routes/course.routes.js';

// Import middleware
import { errorHandler, notFound } from './middleware/error.js';
import { rateLimiter } from './middleware/rateLimiter.js';
import logger from './utils/logger.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
app.use(rateLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
}));

// Root route
app.get('/', (req, res) => {
  res.json({
    message: "FutureCorp Learning Management System API",
    version: "2.0.0",
    status: "running",
    features: [
      "3D Interactive Interface",
      "Real-time Collaboration",
      "AI-Powered Learning",
      "Advanced Analytics"
    ],
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      users: "/api/users",
      assignments: "/api/assignments",
      classes: "/api/classes",
      courses: "/api/courses"
    },
    documentation: "Visit /api/health for server status"
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'Supabase PostgreSQL',
    features: {
      '3d_interface': true,
      'real_time': true,
      'ai_chatbot': true,
      'code_playground': true
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/courses', courseRoutes);

// Socket.IO for real-time features
io.on('connection', (socket) => {
  logger.info(`User connected: ${socket.id}`);

  // Join class room
  socket.on('join-class', (classId: string) => {
    socket.join(`class-${classId}`);
    socket.to(`class-${classId}`).emit('user-joined', { socketId: socket.id });
  });

  // Leave class room
  socket.on('leave-class', (classId: string) => {
    socket.leave(`class-${classId}`);
    socket.to(`class-${classId}`).emit('user-left', { socketId: socket.id });
  });

  // Chat messages
  socket.on('chat-message', (data: { classId: string; message: string; user: any }) => {
    io.to(`class-${data.classId}`).emit('chat-message', {
      id: Date.now().toString(),
      message: data.message,
      user: data.user,
      timestamp: new Date().toISOString()
    });
  });

  // Code collaboration
  socket.on('code-change', (data: { assignmentId: string; code: string }) => {
    socket.to(`assignment-${data.assignmentId}`).emit('code-update', data);
  });

  socket.on('disconnect', () => {
    logger.info(`User disconnected: ${socket.id}`);
  });
});

// Error handling middleware (must be last)
app.use(notFound);
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  logger.info(`🚀 FutureCorp LMS Server v2.0 running on port ${PORT}`);
  logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`🌐 CORS Origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  logger.info(`🗄️  Database: Supabase PostgreSQL`);
  logger.info(`🔌 WebSocket: Enabled for real-time features`);
  logger.info(`🎮 3D Interface: Ready for immersive learning`);
});

// Graceful shutdown
const gracefulShutdown = (signal: string) => {
  logger.info(`${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      logger.error('Error closing server:', err);
      process.exit(1);
    }
    
    logger.info('Server closed successfully');
    process.exit(0);
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    logger.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));

export { io };