import React from 'react';
import { Link } from 'react-router-dom';


export default function Welcome() {
  return (
    <div className="relative bg-[url('./images/PS5.jpg')] bg-cover bg-center bg-repeat min-h-screen flex items-center justify-center p-4">
      {/* Dark overlay */}
      {/* <div className="absolute inset-0 bg-black/60" /> */}

      {/* Card */}
      <div className="relative z-10 flex flex-col bg-black  border-2 border-white rounded-2xl p-6 sm:p-8 md:p-12 max-w-md w-full text-center">
        {/* Title */}
        <h1 className="flex flex-wrap justify-center text-4xl sm:text-5xl md:text-6xl font-extrabold mb-8">
          <span className="ml-2 text-yellow-300">P</span>
          <span className="text-red-500">O</span>
          <span className="text-green-400">N</span>
          <span className="text-blue-400">G</span>
          <Link to="/dashboard" className="ml-2 p-1 text-xs bg-gray-600 hover:bg-gray-500 rounded text-white transition">▶</Link>
        </h1>

        {/* Buttons - check in colour in .css*/}
        <div className="space-y-4">
          <div><Link to="/login">
          <button
            className="w-full py-2 sm:py-3 px-4 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-full text-white text-lg transition"
          >
            Login
          </button></Link>
          </div>
        <div><Link to="/signUp">
          <button
            className="w-full py-2 sm:py-3 px-4 bg-gray-700 hover:bg-gray-600 active:bg-gray-800 rounded-full text-white text-lg transition"
          >
            Signup
          </button></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
