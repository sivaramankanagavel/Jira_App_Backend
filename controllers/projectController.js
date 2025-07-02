const Project = require('../models/Project');

async function getAllProjects(res) {
  try {
    const projects = await Project.find().populate('members ownerId');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getProjectById(req, res) {
  try {
    const project = await Project.findById(req.params.id).populate('members ownerId');
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function createProject(req, res) {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateProject(req, res) {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function deleteProject(req, res) {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function addMembers(req, res) {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
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
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.members = project.members.filter(id => id.toString() !== req.params.userId);
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
  removeMember
};