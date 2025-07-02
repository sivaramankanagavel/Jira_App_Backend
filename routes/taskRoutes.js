const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const {
    getAllTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    getTasksByProject,
    getTasksByAssignee
} = require('../controllers/taskController');

const router = express.Router();

router.get('/', auth, getAllTasks);
router.get('/:id', auth, getTaskById);
router.post('/', auth, createTask);
router.put('/:id', auth, updateTask);
router.delete('/:id', auth, deleteTask);

router.get('/project/:projectId', auth, getTasksByProject);
router.get('/user/:userId', auth, getTasksByAssignee);

module.exports = router;
