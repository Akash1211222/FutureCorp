import "dotenv/config";
import express from "express";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/health", (_req, res) => res.json({ ok: true }));

const PORT = Number(process.env.PORT) || 5050;
app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});