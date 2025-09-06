import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import usersRoutes from "./routes/users.routes.js";
import assignmentsRoutes from "./routes/assignments.routes.js";
import classesRoutes from "./routes/classes.routes.js";
import { errorHandler, notFound } from "./middlewares/error.js";

const app = express();

// Middleware
app.use(cors({ 
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan("combined"));

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ 
    message: "Server is running with Supabase", 
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5050,
    database: "Supabase PostgreSQL"
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/classes", classesRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS Origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🗄️  Database: Supabase PostgreSQL`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  server.close((err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    
    console.log('Server closed.');
    process.exit(0);
  });
  
  // Force exit after 10 seconds
  setTimeout(() => {
    console.error('Forced shutdown after timeout');
    process.exit(1);
  }, 10000);
};

// Handle shutdown signals
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2')); // nodemon restart signal