import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";
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
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});