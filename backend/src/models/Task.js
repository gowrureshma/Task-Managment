const mongoose = require('mongoose');

/**
 * Task Schema - Stores task information with assignments and status tracking
 */
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a task title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
      required: [true, 'Task must belong to a project'],
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be assigned to a user'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must be created by a user'],
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
    },
    dueDate: {
      type: Date,
    },
    isOverdue: {
      type: Boolean,
      default: false,
    },
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        text: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

/**
 * Middleware: Calculate if task is overdue
 */
taskSchema.pre('save', function (next) {
  if (this.dueDate && new Date(this.dueDate) < new Date() && this.status !== 'Completed') {
    this.isOverdue = true;
  } else {
    this.isOverdue = false;
  }
  next();
});

/**
 * Middleware: Populate related user information
 */
taskSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'assignedTo createdBy',
    select: 'name email role',
  }).populate({
    path: 'projectId',
    select: 'title',
  });
  next();
});

// Indexing for better query performance
taskSchema.index({ projectId: 1 });
taskSchema.index({ assignedTo: 1 });
taskSchema.index({ createdBy: 1 });
taskSchema.index({ status: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ isOverdue: 1 });

module.exports = mongoose.model('Task', taskSchema);
