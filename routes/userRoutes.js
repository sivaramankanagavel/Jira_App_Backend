const express = require('express');
const auth = require('../middleware/authMiddleware.js');
const { getAllUsers, getUserById, createUser, updateUser, deleteUser } = require('../controllers/userController');

const router = express.Router();

router.get('/', auth, getAllUsers);
router.get('/:id', auth, getUserById);
router.post('/', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
