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

  const [scheduledMeetings, setScheduledMeetings] = useState([]); // For calendar view

  const navigate = useNavigate();
  const { user2, reason, date, day, time, duration, meetingLink } = formData;

  // Fetch scheduled meetings for the calendar view
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

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

      await axios.post(
        'http://localhost:5000/api/meetings',
        {
          user2,
          reason,
          date,
          day,
          time,
          duration,
          meetingLink,
        },
        {
          headers: {
            'x-auth-token': token,
          },
        }
      );

      alert("Meeting Successfully Scheduled");
      navigate('/dashboard');
    } catch (err) {
      console.error(err.response?.data || 'Meeting scheduling failed');
    }
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
          {/* Show all possible dates (1-30) */}
          <select
            name="date"
            value={date}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Date</option>
            {[...Array(30).keys()].map((date) => (
              <option key={date + 1} value={date + 1}>
                {date + 1}
              </option>
            ))}
          </select>

          {/* Show all days (Sunday to Saturday) */}
          <select
            name="day"
            value={day}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Day</option>
            {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>

          {/* Show all time slots (1 to 24) */}
          <select
            name="time"
            value={time}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Select Time</option>
            {[...Array(24).keys()].map((time) => (
              <option key={time + 1} value={time + 1}>
                {time + 1}:00
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
          selected={null}
          onChange={() => {}}
          inline
          className="w-full p-2 border rounded-lg"
          highlightDates={scheduledMeetings.map((meeting) => new Date(2023, 9, meeting.date))}
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
