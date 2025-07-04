// 📁 routes/projectRoutes.js
const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addMembers,
  removeMember
} = require('../controllers/projectController');

const router = express.Router();

// Only ADMIN middleware
const adminOnly = (req, res, next) => {
  if (req.user.role !== 'ADMIN') {
    return res.status(403).json({ message: 'Access denied: ADMIN only' });
  }
  next();
};

router.get('/user', auth, getAllProjects);
router.get('/:id', auth, getProjectById);
router.post('/', auth, createProject);
router.put('/:id', auth, updateProject);
router.delete('/:id', auth, adminOnly, deleteProject);
router.post('/:id/members', auth, addMembers);
router.delete('/:id/members/:userId', auth, removeMember);

module.exports = router;
