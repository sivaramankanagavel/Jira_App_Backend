const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: false
  },
  endDate: {
    type: Date,
    required: false
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;