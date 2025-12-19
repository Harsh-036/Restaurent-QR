import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ForgetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setMessage('Invalid or missing reset token');
    }
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:3000/api/forget-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Password updated successfully');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage(data.message || 'Failed to update password');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
      console.error('Error updating password:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white">
        <div className="w-full flex justify-center items-center p-6">
          <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20 text-center">
            <h2 className="text-3xl font-bold mb-4">Invalid Link</h2>
            <p className="text-gray-300 mb-6">This password reset link is invalid or has expired.</p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold shadow-lg"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            Set New Password
          </h1>

          <p className="text-gray-300 mt-6 text-lg leading-relaxed">
            Enter your new password below to complete the reset process.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (FORM) */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20">

          <h2 className="text-3xl font-bold text-center mb-3">
            New Password
          </h2>

          <p className="text-gray-300 text-center mb-8 text-sm">
            Create a strong password for your account
          </p>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm mb-1 text-gray-200">
                New Password
              </label>
              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-200">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Password"}
            </button>
          </form>

          {/* MESSAGE */}
          {message && (
            <div className={`mt-4 p-3 rounded-lg text-center ${
              message === 'Password updated successfully'
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

export default ForgetPassword;
