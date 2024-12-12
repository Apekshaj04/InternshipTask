import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Home.module.css';

const HomePage = () => {
  const [tasks, setTasks] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', status: 'pending', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log(token);
      const response = await axios.get('http://localhost:8080/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
      setError('Failed to fetch tasks.');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      console.log(token)
      const response = await axios.post('http://localhost:8080/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks([...tasks, response.data]);
      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to add task.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setFormData({ ...task });
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:8080/tasks/${editingTask._id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.map((task) => (task._id === editingTask._id ? response.data : task)));
      setEditingTask(null);
      setFormData({ title: '', description: '', status: 'pending', dueDate: '' });
    } catch (error) {
      console.error(error);
      setError('Failed to update task.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8080/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error(error);
      setError('Failed to delete task.');
    }
  };

  return (
    <div className={styles.container}>
      <h1>Task Manager</h1>
      {error && <p className={styles.error}>{error}</p>}

   
      <form className={styles.form} onSubmit={editingTask ? handleUpdateTask : handleAddTask}>
        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Task Description"
          value={formData.description}
          onChange={handleChange}
          required
        />
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          required
        />
        <button type="submit">{editingTask ? 'Update Task' : 'Add Task'}</button>
      </form>


      <div className={styles.taskList}>
        {tasks.map((task) => (
          <div key={task._id} className={styles.task}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>
            <button onClick={() => handleEditTask(task)}>Edit</button> &nbsp;&nbsp;
            <button onClick={() => handleDeleteTask(task._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
