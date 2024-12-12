
const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/:id', userController.getUserDetails);
router.post('/assign-task', userController.assignTaskToUser);

module.exports = router;
