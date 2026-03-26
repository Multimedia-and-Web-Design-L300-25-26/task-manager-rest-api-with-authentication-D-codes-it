import express from "express";
import Task from "../models/Task.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply auth middleware to all routes below this line
router.use(authMiddleware);

// POST /api/tasks
router.post("/", async (req, res) => {
  try {
    const { title, description } = req.body;

    // - Create task & Attach owner = req.user._id
    const task = await Task.create({
      title,
      description,
      owner: req.user._id
    });

    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Failed to create task" });
  }
});

// GET /api/tasks
router.get("/", async (req, res) => {
  try {
    // - Return only tasks belonging to req.user
    const tasks = await Task.find({ owner: req.user._id });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    // - Check ownership (make sure the logged-in user owns the task)
    if (task.owner.toString() !== req.user._id.toString()) {
      return res.status(401).json({ error: "User not authorized to delete this task" });
    }

    // - Delete task
    await task.deleteOne();
    res.status(200).json({ message: "Task removed" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

export default router;