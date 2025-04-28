import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [activeView, setActiveView] = useState('profile');
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeView) {
      case 'profile':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Profile</h3>
            <p className="text-gray-600">Manage your profile settings here.</p>
            {/* Add profile info */}
          </div>
        );
      case 'game':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Game</h3>
            <p className="text-gray-600">Matchmaking with online players.</p>
            {/* Add matchmaking */}
             <button
                onClick={() => navigate('/game')}
                className="mt-4 w-full flex justify-center items-center p-3 space-x-2 font-sans font-bold text-white rounded-md shadow-lg px-6 bg-cyan-700 shadow-cyan-100 hover:bg-opacity-90 shadow-sm hover:shadow-lg border transition hover:-translate-y-0.5 duration-150"
              >
                <span>Online Match</span>
              </button>
              <button
                onClick={() => navigate('/game')}
                className="mt-4 w-full flex justify-center items-center p-3 space-x-2 font-sans font-bold text-white rounded-md shadow-lg px-6 bg-cyan-700 shadow-cyan-100 hover:bg-opacity-90 shadow-sm hover:shadow-lg border transition hover:-translate-y-0.5 duration-150"
              >
                <span>Local Match</span>
              </button>
          </div>
        );
      case 'chat':
        return (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Chat</h3>
            <p className="text-gray-600">Connect with other players.</p>
            {/* Add chat interface */}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    // Global Container
    <div className="relative bg-[url('./images/PS5.jpg')] bg-cover bg-center bg-repeat min-h-screen flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="relative flex flex-col m-12 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 md:m-0 w-full max-w-4xl">

        {/* Left Sidebar */}
        <div className="w-full md:w-1/3 p-6 md:p-12 border-r border-gray-200">
          <h2 className="font-mono mb-8 text-3xl font-bold text-gray-800">Dashboard</h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveView('profile')}
              className={`w-full p-3 text-left rounded-md font-medium transition duration-150 ${
                activeView === 'profile' ? 'bg-cyan-100 text-cyan-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveView('game')}
              className={`w-full p-3 text-left rounded-md font-medium transition duration-150 ${
                activeView === 'game' ? 'bg-cyan-100 text-cyan-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Game
            </button>
            <button
              onClick={() => setActiveView('chat')}
              className={`w-full p-3 text-left rounded-md font-medium transition duration-150 ${
                activeView === 'chat' ? 'bg-cyan-100 text-cyan-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Chat
            </button>
             <button
                onClick={() => navigate('/')}
                className="mt-8 w-full p-3 text-left rounded-md font-medium text-red-600 hover:bg-red-50 transition duration-150"
              >
                Logout
              </button>
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="w-full md:w-2/3 p-6 md:p-12">
          {renderContent()}
        </div>
         <div
            onClick={() => navigate('/')} // Navigate back to Welcome page on click
            className="group absolute -top-5 right-4 flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full md:bg-white md:top-4 hover:cursor-pointer hover:-translate-y-0.5 transition duration-150"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-black group-hover:text-gray-600"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </div>

      </div>
    </div>
  );
}

export default Dashboard;