import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from "react-icons/fc";
import { Si42 } from "react-icons/si";

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(''); // Clear previous errors
    const loginData = { email, password };

    try {
      const response = await fetch('/logIn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        console.log('Login successful:', data);
        navigate('/game');
      } else {
        setErrorMessage(data.error || 'Login failed. Please try again.');
        console.error('Login failed:', data.error);
      }
    } catch (error) {
      setErrorMessage('An error occurred during login. Please check the console.');
      console.error('Error during login:', error);
    }
  };

  return (
    // Global Container
    <div className="relative bg-[url('./images/PS5.jpg')] bg-cover bg-center bg-repeat min-h-screen flex items-center justify-center p-4">
      {/* Card Container */}
      <div className="relative flex flex-col m-6 space-y-10 bg-white shadow-2xl rounded-2xl md:flex-row md:space-y-0 md:m-0 max-w-xl">
        {/* Left Side */}
        <div className="p-6 md:p-12">
          {/* Top Content */}
          <h2 className="font-mono mb-5 text-4xl font-bold text-gray-800">Log In</h2> {/* Adjusted text color */}
          <p className="max-w-sm mb-12 font-sans font-light text-gray-600">
            Log in to your account to access the game and features.
          </p>

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-6 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light mb-4 text-gray-800" // Adjusted text color
              placeholder="Enter your email address"
              required
            />

            {/* Password Input */}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-6 border border-gray-300 rounded-md placeholder:font-sans placeholder:font-light text-gray-800" // Adjusted text color
              placeholder="Enter your password"
              required
            />

            {/* Error Message Display */}
            {errorMessage && (
              <p className="mt-4 text-red-500 text-sm">{errorMessage}</p>
            )}

            {/* Middle Content */}
            <div className="flex flex-col items-center justify-between mt-6 space-y-6 md:flex-row md:space-y-0">
              <div className="font-thin text-cyan-700 cursor-pointer">Forgot password</div>

              <button
                type="submit"
                className="w-full md:w-auto flex justify-center items-center p-6 space-x-4 font-sans font-bold text-white rounded-md shadow-lg px-9 bg-cyan-700 shadow-cyan-100 hover:bg-opacity-90 shadow-sm hover:shadow-lg border transition hover:-translate-y-0.5 duration-150"
              >
                <span>Login</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-7"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#ffffff"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <line x1="13" y1="18" x2="19" y2="12" />
                  <line x1="13" y1="6" x2="19" y2="12" />
                </svg>
              </button>
            </div>
          </form>

          {/* Border */}
          <div className="mt-12 border-b border-b-gray-300"></div>

          {/* Bottom Content */}
          <p className="py-6 text-sm font-thin text-center text-gray-400">
            or log in with
          </p>

          {/* Bottom Buttons Container */}
          <div className="flex flex-col space-x-0 space-y-6 md:flex-row md:space-x-4 md:space-y-0">
            <button
              className="flex items-center justify-center py-2 space-x-3 border border-gray-300 rounded shadow-sm hover:bg-opacity-30 hover:shadow-lg hover:-translate-y-0.5 transition duration-150 md:w-1/2 text-gray-800" // Adjusted text color
            >
              <Si42 className="w-9 h-9" />
              <span >Intra</span>
            </button>
            <button
              className="flex items-center justify-center py-2 space-x-3 border border-gray-300 rounded shadow-sm hover:bg-opacity-30 hover:shadow-lg hover:-translate-y-0.5 transition duration-150 md:w-1/2 text-gray-800" // Adjusted text color
            >
              <FcGoogle className="w-9 h-9" />
              <span>Google</span>
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        {/* <div><img src="./images/image.jpg" /></div> */}

        {/* Close Button */}
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

export default Login;