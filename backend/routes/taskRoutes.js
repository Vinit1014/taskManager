const express = require('express');
const { addTask, getAllTasks, updateTask, deleteTasks } = require('../controllers/taskController');

const router = express.Router();

router.post('/', addTask); // Add a new task
router.get('/:userId', getAllTasks); // Get all tasks for a user
router.put('/:taskId', updateTask); // Update a specific task
router.delete('/delete', deleteTasks); // Delete all selected tasks

module.exports = router;
