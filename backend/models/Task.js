const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({  
    title: {
        type: String,
        required: true,
    },
    startTime: {
        type: Date,
        required: true,
    },
    endTime: {
        type: Date,
    },
    priority: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    status: {
        type: String,
        enum: ['Pending', 'Finished'],
        default: 'Pending',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    totalTimeToFinish: {
        type: Number, // Store total time in hours
        default: 0, // Default to 0 for tasks without an end time
    },
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;
