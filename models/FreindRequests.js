const mongoose = require('mongoose');

const friendRequestSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
  status: { type: String, default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('friendrequests', friendRequestSchema);
