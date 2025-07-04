const mongoose = require('mongoose'); // Add this import
const Task = require("../models/Task");

async function getAllTasks(req, res) {
  try {
    const tasks = await Task.find().populate("ownerId assigneeId projectId");
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTaskById(req, res) {
  try {
    const { id } = req.params;

    // Add ObjectID validation
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid task ID format" });
    }

    const task = await Task.findById(id).populate(
      "ownerId assigneeId projectId"
    );
    if (!task) return res.status(404).json({ message: "Task not found" });
    if (
      req.method !== "GET" &&
      task.ownerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createTask(req, res) {
  try {
    const task = new Task(req.body);
    const saved = await task.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Task not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteTask(req, res) {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTasksByProject(req, res) {
  try {
    const tasks = await Task.find({ projectId: req.params.projectId }).populate(
      "assigneeId ownerId"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getTasksByAssignee(req, res) {
  try {
    if (
      req.params.userId !== req.user._id.toString() &&
      req.user.role !== "ADMIN"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const tasks = await Task.find({ assigneeId: req.params.userId }).populate(
      "projectId ownerId"
    );
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getAssignedTasks(req, res) {
  try {
    const { projectId, userId } = req.query;

    // Validate both parameters exist
    if (!projectId || !userId) {
      return res.status(400).json({
        error: "Missing projectId or userId in query parameters"
      });
    }

    // Validate both IDs
    if (
      !mongoose.Types.ObjectId.isValid(projectId) ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({ error: "Invalid ID format" });
    }

    // Find tasks assigned to user in specific project
    const tasks = await Task.find({
      projectId,
      assigneeId: userId
    }).populate("ownerId projectId");

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTasksByProject,
  getTasksByAssignee,
  getAssignedTasks
};
