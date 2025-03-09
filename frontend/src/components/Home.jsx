import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <h1 className="text-5xl font-bold mb-4 text-center">
        Welcome to Meeting Scheduler 
      </h1>
      <p className="text-xl mb-8 text-center">
        Easily schedule and manage your meetings with others.
      </p>
      <div className="flex gap-4">
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-white text-purple-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;