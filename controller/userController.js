
const User = require('../models/User');
const Task = require('../models/Task');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET; 

exports.registerUser = async (req, res) => {
  try {
    const { name, username, password, phoneNumber, mail } = req.body;

    const existingUser = await User.findOne({ mail });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      username,
      password: hashedPassword,
      phoneNumber,
      mail,
    });

    await user.save();
    res.status(201).json({ userId:user._id});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    const user = await User.findOne({ mail });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    console.log(1);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log(2);

    const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log(3);
console.log(token);
    res.status(200).json({ token:token ,userId:user._id});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.getUserDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate('tasks');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};


exports.assignTaskToUser = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const user = await User.findById(userId);
    const task = await Task.findById(taskId);

    if (!user || !task) {
      return res.status(404).json({ error: 'User or Task not found' });
    }

    user.tasks.push(task);
    await user.save();

    res.status(200).json({ message: 'Task assigned to user successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
