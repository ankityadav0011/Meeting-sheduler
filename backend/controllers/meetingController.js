const Meeting = require('../models/Meeting');
const User = require('../models/User');
const sendEmail = require('../utils/email');

// Schedule Meeting
exports.scheduleMeeting = async (req, res) => {
  const { user2, reason, date, day, time, duration, meetingLink } = req.body;
  try {
    const user1 = req.user.id;

    // Fetch user details
    const user1Details = await User.findById(user1);
    const user2Details = await User.findOne({ email: user2 });

    if (!user2Details) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Create meeting
    const meeting = new Meeting({
      user1,
      user2: user2Details._id,
      reason,
      date,
      day,
      time,
      duration,
      meetingLink, // Save meeting link
    });

    await meeting.save();

    // Send email to user1
    const user1EmailText = `
      Hi ${user1Details.name},
      Your meeting with ${user2Details.name} has been scheduled.
      Details:
      - Reason: ${reason}
      - Date: ${date}
      - Day: ${day}
      - Time: ${time}:00
      - Duration: ${duration} minutes
      ${meetingLink ? `- Meeting Link: ${meetingLink}` : ''}
    `;
    await sendEmail(user1Details.email, 'Meeting Scheduled', user1EmailText);

    // Send email to user2
    const user2EmailText = `
      Hi ${user2Details.name},
      You have a meeting scheduled with ${user1Details.name}.
      Details:
      - Reason: ${reason}
      - Date: ${date}
      - Day: ${day}
      - Time: ${time}:00
      - Duration: ${duration} minutes
      ${meetingLink ? `- Meeting Link: ${meetingLink}` : ''}
    `;
    await sendEmail(user2Details.email, 'Meeting Scheduled', user2EmailText);

    res.json(meeting);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getMeetings = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all meetings where the user is either user1 or user2
    const meetings = await Meeting.find({
      $or: [{ user1: userId }, { user2: userId }],
    })
      .populate('user1', 'name email') // Populate user1 details
      .populate('user2', 'name email'); // Populate user2 details

    res.json(meetings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
