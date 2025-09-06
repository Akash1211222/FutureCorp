import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { prisma } from "./lib/prisma.js";
import { authRoutes } from "./routes/auth.routes.js";
import { usersRoutes } from "./routes/users.routes.js";
import { assignmentsRoutes } from "./routes/assignments.routes.js";
import { classesRoutes } from "./routes/classes.routes.js";
import { errorHandler } from "./middlewares/error.js";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/assignments", assignmentsRoutes);
app.use("/api/classes", classesRoutes);

// Error handling middleware
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5050;
const server = app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});

// Graceful shutdown handling
const gracefulShutdown = async (signal: string) => {
  console.log(`\n${signal} received. Starting graceful shutdown...`);
  
  // Close server
  server.close(async (err) => {
    if (err) {
      console.error('Error closing server:', err);
      process.exit(1);
    }
    
    console.log('Server closed.');
    
    // Close database connection
    try {
      await prisma.$disconnect();
      console.log('Database connection closed.');
    } catch (error) {
      console.error('Error closing database connection:', error);
    }
    
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