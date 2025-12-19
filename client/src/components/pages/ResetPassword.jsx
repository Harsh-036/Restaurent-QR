import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [emailFound, setEmailFound] = useState(false);
  const navigate = useNavigate();

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/find-account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('Your email has been found');
        setEmailFound(true);
      } else {
        setMessage('Your email is not found');
        setEmailFound(false);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error verifying email:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password reset email sent successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to send reset email');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error sending reset email:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white">
      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16">
        <div className="max-w-lg">
          <img
            src="/vite.svg"
            alt="Restaurant Logo"
            className="h-24 w-24 mb-8 bg-white/10 p-4 rounded-full shadow-xl backdrop-blur-md"
          />

          <h1 className="text-5xl font-extrabold leading-snug drop-shadow-lg">
            Reset Password
          </h1>

          <p className="text-gray-300 mt-6 text-lg leading-relaxed">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (FORM) */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20">

          <h2 className="text-3xl font-bold text-center mb-3">
            Find Your Account
          </h2>

          <p className="text-gray-300 text-center mb-8 text-sm">
            Enter your email address to search for your account
          </p>

          {/* FORM */}
          <form onSubmit={handleVerifyEmail} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* VERIFY BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {/* RESET PASSWORD BUTTON (only show if email found) */}
          {emailFound && (
            <div className="mt-6">
              <button
                onClick={handleResetPassword}
                disabled={loading}
                className="w-full py-3 bg-green-600 hover:bg-green-700 transition rounded-xl text-white font-semibold shadow-lg disabled:opacity-50"
              >
                {loading ? "Sending..." : "Reset Password"}
              </button>
            </div>
          )}

          {/* MESSAGE */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message === 'Your email has been found' || message === 'Password reset email sent successfully'
                ? 'bg-green-500/20 text-green-300'
                : 'bg-red-500/20 text-red-300'
            }`}>
              {message}
            </div>
          )}

          {/* BACK TO LOGIN */}
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/login')}
              className="text-blue-400 hover:text-blue-300 transition text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
