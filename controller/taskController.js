const Task = require('../models/Task');
const { validationResult } = require('express-validator');

exports.addTask = async (req, res) => {
  const errors = validationResult(req);
  console.log(1);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, status, dueDate } = req.body;

    console.log( req.user.id)
    const task = new Task({
      title,
      description,
      status,
      dueDate,
      user: req.user.id,
    });
    console.log(1);

    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const { status, sortBy, order } = req.query;
    const filter = { user: req.user.id }; 
    if (status) filter.status = status; 

    const sort = sortBy ? { [sortBy]: order === 'desc' ? -1 : 1 } : {};

    const tasks = await Task.find(filter).sort(sort);
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, dueDate } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }


    task.title = title || task.title;
    task.description = description || task.description;
    task.status = status || task.status;
    task.dueDate = dueDate || task.dueDate;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user.id });
    if (!task) {
      return res.status(404).json({ error: 'Task not found or not authorized' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
