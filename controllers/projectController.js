const Project = require("../models/Project");

async function getAllProjects(req, res) {
  try {
    // Get userId from query params
    const userId = req.query.userId;
    
    let projects;
    if (userId) {
      // Find projects where user is owner or member
      projects = await Project.find({
        $or: [
          { ownerId: userId },
          { members: userId }
        ]
      }).populate('members ownerId');
    } else {
      // For admins, get all projects
      projects = await Project.find().populate('members ownerId');
    }
    
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id).populate(
      "members ownerId"
    );
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProject(req, res) {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
}

async function updateProject(req, res) {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addMembers(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });
    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.members.push(...req.body.userIds);
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function removeMember(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Project not found" });

    if (project.ownerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    project.members = project.members.filter(
      (id) => id.toString() !== req.params.userId
    );
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMember,
};
