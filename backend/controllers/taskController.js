const Task = require('../models/Task');
const moment = require('moment');

exports.addTask = async (req, res) => {
    try {
        const { title, startTime, endTime, priority, userId } = req.body;

        if (!title || !startTime || !priority || !userId) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }
        
        const parsedStartTime = moment(startTime).local().toDate();
        const parsedEndTime = endTime ? moment(endTime).local().toDate() : null;

        if (parsedEndTime && parsedEndTime <= parsedStartTime) {
            return res.status(400).json({ message: 'End time must be greater than start time' });
        }
        // Calculate total time to finish in hours
        let totalTimeToFinish = 0;
        if (parsedEndTime) {
            const timeDiff = parsedEndTime - parsedStartTime; // Difference in milliseconds
            totalTimeToFinish = Math.ceil(timeDiff / (1000 * 60 * 60)); // Convert to hours and round up
        }
        
        // Create the task with default status as "pending"
        const task = new Task({
            title,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            priority,
            status: 'Pending', // Default status
            userId,
            totalTimeToFinish, // Add calculated field
        });
    
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const { userId } = req.params; // Extract userId from route params
        const { priority, status, sortBy } = req.query; // Optional filters from query params
        
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
    
        // Build query dynamically based on filters
        const query = { userId };
        if (priority) {
            query.priority = priority;
        }
        if (status) {
            query.status = status;
        }
    
        // Determine the sort order based on the 'sortBy' query parameter
        let sort = {};
    
        if (sortBy) {
            switch (sortBy) {
            case 'startTimeAsc':
                sort = { startTime: 1 }; // Sort by start time ASC
                break;
            case 'startTimeDesc':
                sort = { startTime: -1 }; // Sort by start time DESC
                break;
            case 'endTimeAsc':
                sort = { endTime: 1 }; // Sort by end time ASC
                break;
            case 'endTimeDesc':
                sort = { endTime: -1 }; // Sort by end time DESC
                break;
            default:
                sort = { startTime: 1 }; // Default to start time ASC if no sort option provided
            }
        } else {
            sort = { startTime: 1 }; // Default sort if no sort query param is given
        }
    
        // Fetch tasks from the database
        const tasks = await Task.find(query).sort(sort);
    
        // Format tasks with readable date formats for start and end times
        const formattedTasks = tasks.map(task => ({
            ...task._doc,
            startTime: moment(task.startTime).local().format('DD-MM-YYYY HH:mm'), // Convert to local time
            endTime: task.endTime ? moment(task.endTime).local().format('DD-MM-YYYY HH:mm') : null, // Convert to local time
        }));
    
        res.status(200).json(formattedTasks);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params; // Extract taskId from route params
        const { title, startTime, endTime, priority, status } = req.body;
        
        if (!taskId) {
            return res.status(400).json({ message: 'Task ID is required' });
        }
    
        // Prepare update data
        const updateData = {};
        if (title) updateData.title = title;
        if (startTime) updateData.startTime = moment(startTime).local().toDate();
        if (endTime) updateData.endTime = moment(endTime).local().toDate();
        if (priority) updateData.priority = priority;
        if (status) {
            updateData.status = status;
    
            // If marking as finished, update endTime with the current time
            if (status === 'Finished') {
                updateData.endTime = new Date();
            }
        }

        // Fetch the existing task to calculate totalTimeToFinish
        const existingTask = await Task.findById(taskId);
        if (!existingTask) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Calculate totalTimeToFinish if startTime or endTime is updated
        const finalStartTime = updateData.startTime || existingTask.startTime;
        const finalEndTime = updateData.endTime || existingTask.endTime;

        if (finalStartTime && finalEndTime && new Date(finalEndTime) <= new Date(finalStartTime)) {
            return res.status(400).json({ message: 'End time must be greater than start time' });
        }

        if (finalStartTime && finalEndTime) {
            const timeDiff = new Date(finalEndTime) - new Date(finalStartTime); // Difference in milliseconds
            updateData.totalTimeToFinish = Math.ceil(timeDiff / (1000 * 60 * 60)); // Convert to hours and round up
        }

        // Update the task
        const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    
        if (!updatedTask) {
            return res.status(404).json({ message: 'Task not found' });
        }
    
        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


exports.deleteTasks = async (req, res) => {
    try {
        const { taskIds } = req.body;  // Array of task IDs to be deleted
    
        if (!taskIds || taskIds.length === 0) {
            return res.status(400).json({ message: 'No task IDs provided' });
        }
        
        // Delete multiple tasks using $in operator to match any of the given IDs
        const deletedTasks = await Task.deleteMany({ _id: { $in: taskIds } });
        
        if (deletedTasks.deletedCount === 0) {
            return res.status(404).json({ message: 'No tasks found with the provided IDs' });
        }
    
        res.status(200).json({
            message: `${deletedTasks.deletedCount} task(s) deleted successfully`,
            deletedTasks
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
  
  