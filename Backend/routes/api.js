const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const { register, login, getProfile, updateProfile } = require('../Controllers/authController');
const { getTasks, createTask, updateTask, deleteTask } = require('../Controllers/taskController');

// Auth Routes
router.post('/auth/signup', register);
router.post('/auth/login', login);
router.get('/me', authMiddleware, getProfile);
router.put('/me', authMiddleware, updateProfile);

// Task Routes
router.get('/tasks', authMiddleware, getTasks);
router.post('/tasks', authMiddleware, createTask);
router.put('/tasks/:id', authMiddleware, updateTask);
router.delete('/tasks/:id', authMiddleware, deleteTask);

module.exports = router;