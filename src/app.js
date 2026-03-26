import express from "express";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

export default app;