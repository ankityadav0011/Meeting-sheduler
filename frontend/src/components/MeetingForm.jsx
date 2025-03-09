import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const MeetingForm = () => {
  const [formData, setFormData] = useState({
    user2: '',
    reason: '',
    date: '',
    day: '',
    time: '',
    duration: '1 hour', // Default duration
    meetingLink: '', // New field for meeting link
  });

  const [availableSlots, setAvailableSlots] = useState([]);
  const [availableDates, setAvailableDates] = useState([]);
  const [availableDays, setAvailableDays] = useState([]);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [scheduledMeetings, setScheduledMeetings] = useState([]); // For calendar view

  const navigate = useNavigate();

  const { user2, reason, date, day, time, duration, meetingLink } = formData;

  // Fetch available slots and scheduled meetings from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        // Fetch available slots
        const availableSlotsRes = await axios.get('http://localhost:5000/api/meetings/available-slots', {
          headers: {
            'x-auth-token': token,
          },
        });
        setAvailableSlots(availableSlotsRes.data);

        // Extract unique dates, days, and times
        const dates = [...new Set(availableSlotsRes.data.map((slot) => slot.date))];
        const days = [...new Set(availableSlotsRes.data.map((slot) => slot.day))];
        const times = [...new Set(availableSlotsRes.data.map((slot) => slot.time))];

        setAvailableDates(dates);
        setAvailableDays(days);
        setAvailableTimes(times);

        // Fetch scheduled meetings for the calendar view
        const scheduledMeetingsRes = await axios.get('http://localhost:5000/api/meetings', {
          headers: {
            'x-auth-token': token,
          },
        });
        setScheduledMeetings(scheduledMeetingsRes.data);
      } catch (err) {
        console.error(err.response?.data || 'Error fetching data');
      }
    };
    fetchData();
  }, []);

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');

      const res = await axios.post(
        'http://localhost:5000/api/meetings',
        {
          user2,
          reason,
          date,
          day,
          time,
          duration, // Send duration as a string (no parsing)
          meetingLink, // Send meeting link (optional)
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );
      alert("Meeting Successfully Sheduled")
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || 'Meeting scheduling failed');
    }
  };

  // Function to highlight scheduled dates in the calendar
  const highlightScheduledDates = (date) => {
    const dayOfMonth = date.getDate();
    return scheduledMeetings.some((meeting) => meeting.date === dayOfMonth);
  };

  return (
    <div className="flex flex-col md:flex-row p-4 gap-8">
      {/* Meeting Form */}
      <div className="w-full md:w-1/2">
        <h1 className="text-2xl font-bold mb-4">Schedule Meeting</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="User 2 Email"
            name="user2"
            value={user2}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Reason"
            name="reason"
            value={reason}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <select
            name="date"
            value={date}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Date</option>
            {availableDates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <select
            name="day"
            value={day}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Day</option>
            {availableDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <select
            name="time"
            value={time}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Time</option>
            {availableTimes.map((time) => (
              <option key={time} value={time}>
                {time}:00
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Duration (e.g., 1 hour 30 minutes)"
            name="duration"
            value={duration}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          />
          <input
            type="text"
            placeholder="Meeting Link (optional)"
            name="meetingLink"
            value={meetingLink}
            onChange={onChange}
            className="w-full p-2 border rounded-lg"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Schedule
          </button>
        </form>
      </div>

      {/* Calendar View */}
      <div className="w-full md:w-1/2">
        <h2 className="text-2xl font-bold mb-4">Scheduled Meetings</h2>
        <DatePicker
          selected={null} // No date is selected
          onChange={() => {}} // No action on date selection
          inline // Show calendar inline
          className="w-full p-2 border rounded-lg"
          highlightDates={scheduledMeetings.map((meeting) => new Date(2023, 9, meeting.date))} // Highlight scheduled dates
          renderDayContents={(dayOfMonth, date) => {
            const isScheduled = scheduledMeetings.some(
              (meeting) => meeting.date === date.getDate()
            );
            return (
              <div
                className={`react-datepicker__day ${
                  isScheduled ? 'react-datepicker__day--highlighted' : ''
                }`}
              >
                {dayOfMonth}
              </div>
            );
          }}
        />
      </div>
    </div>
  );
};

export default MeetingForm;