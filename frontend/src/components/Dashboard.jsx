import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/meetings", {
          headers: {
            "x-auth-token": token,
          },
        });
        setMeetings(res.data);
      } catch (err) {
        console.error(err.response?.data || "Error fetching meetings");
      }
    };
    fetchMeetings();
  }, []);

  return (
    <div className="min-h-screen flex flex-col pt-16"> {/* Added pt-16 to add space for the navbar */}
      {/* Navbar */}
      <div className="bg-blue-600 text-white p-4 fixed top-0 left-0 w-full z-10">
        <div className="flex justify-between">
          <h1 className="text-xl">Meeting App</h1>
          <nav>
            <Link to="/" className="mr-4">
              Home
            </Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4 mt-16"> {/* Added mt-16 to provide space for the navbar */}
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <Link
          to="/schedule-meeting"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg mb-4 inline-block"
        >
          Schedule Meeting
        </Link>
        <h2 className="text-xl font-semibold mb-2">Your Meetings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meetings.length > 0 ? (
            meetings.map((meeting) => (
              <div
                key={meeting._id}
                className="bg-white p-4 rounded-lg shadow-md"
              >
                <p className="font-semibold">
                  {meeting.user1.name} - {meeting.user2.name}
                </p>
                <p className="text-gray-600 mt-2">Reason: {meeting.reason}</p>
                <p className="text-gray-600 mt-1">
                  Date: {meeting.date}/{meeting.day} at {meeting.time}:00
                </p>
                {meeting.duration && (
                  <p className="text-gray-600 mt-1">
                    Duration: {meeting.duration} minutes
                  </p>
                )}
              </div>
            ))
          ) : (
            <p>No meetings scheduled.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
