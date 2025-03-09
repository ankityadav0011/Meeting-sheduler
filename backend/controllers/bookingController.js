const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const sendEmail = require('../utils/mailSender'); // For email notifications

exports.createBooking = async (req, res) => {
  const { name, email, date } = req.body;

  if (!name || !email || !date) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if the selected date is available
    const isDateAvailable = await Availability.findOne({ date });

    if (!isDateAvailable) {
      return res.status(400).json({ error: 'Selected date is not available' });
    }

    // Create new booking
    const newBooking = new Booking({ name, email, date });
    await newBooking.save();

    // Optional: Send confirmation email
    await sendEmail(
      email,
      'Meeting Confirmation',
      `Hi ${name}, your meeting is confirmed for ${date}.`
    );

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create booking' });
  }
};
