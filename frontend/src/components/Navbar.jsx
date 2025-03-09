import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-500 to-blue-700 p-4 flex justify-between items-center shadow-md mt-4">
      <Link to="/" className="text-white text-3xl font-extrabold tracking-wide hover:text-gray-300 transition duration-300">
        🗓️ Scheduler
      </Link>
      <div className="flex gap-6">
        <Link
          to="/login"
          className="bg-white text-blue-600 py-2 px-5 rounded-full shadow-md hover:bg-blue-100 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white text-blue-600 py-2 px-5 rounded-full shadow-md hover:bg-blue-100 transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
