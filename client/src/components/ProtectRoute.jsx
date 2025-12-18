import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar';

const ProtectRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sessionToken = localStorage.getItem('sessionToken');
    const token = accessToken || sessionToken;

    if (!token) {
      // No token found, redirect to login
      navigate('/login');
      return;
    }

    // Validate token by making a test request
    const validateToken = async () => {
      try {
        await axios.get('http://localhost:3000/menu', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, redirect to login
        console.error('Token validation failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35]">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectRoute;
