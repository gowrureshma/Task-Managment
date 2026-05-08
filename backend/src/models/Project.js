const mongoose = require('mongoose');

/**
 * Project Schema - Stores project information with team members
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a project title'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must be created by a user'],
    },
    teamMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    status: {
      type: String,
      enum: ['Active', 'Inactive', 'Completed'],
      default: 'Active',
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true }
);

/**
 * Middleware: Populate creator information on query
 */
projectSchema.pre(/^find/, function (next) {
  if (this.options._recursed) {
    return next();
  }
  this.populate({
    path: 'createdBy',
    select: 'name email role',
  });
  next();
});

// Indexing for better query performance
projectSchema.index({ createdBy: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ teamMembers: 1 });

module.exports = mongoose.model('Project', projectSchema);
