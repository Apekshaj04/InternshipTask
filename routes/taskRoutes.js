const express = require('express');
const router = express.Router();
const authenticateUser = require('../middleware/authenticateUser');
const taskController = require('../controller/taskController');

router.post('/tasks',authenticateUser, taskController.addTask);
router.get('/tasks',authenticateUser, taskController.getTasks);
router.put('/tasks/:id', authenticateUser, taskController.updateTask);
router.delete('/tasks/:id', authenticateUser, taskController.deleteTask);

module.exports = router;
