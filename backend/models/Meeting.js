const mongoose = require('mongoose');

const MeetingSchema = new mongoose.Schema({
  user1: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  user2: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  date: {
    type: Number, 
    required: true,
  },
  day: {
    type: String,
    required: true,
  },
  time: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  meetingLink: {
    type: String,
    default: '',
  },
});

module.exports = mongoose.model('Meeting', MeetingSchema);