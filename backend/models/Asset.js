const mongoose = require('mongoose');

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Laptop', 'Monitor', 'License']
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Assigned', 'Maintenance'],
    default: 'Available'
  },
  specifications: {
    type: String,
    required: true
  },
  assignedTo: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Asset', assetSchema);
