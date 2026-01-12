import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import Navbar from './navbar';

const ProtectRoute = ({ children, requiredRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    const sessionToken = localStorage.getItem('sessionToken');
    const token = accessToken || sessionToken;

    if (!token) {
      // No token found, redirect to welcome
      navigate('/welcome');
      return;
    }

    // Function to check if token is expired
    const isTokenExpired = (token) => {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
      } catch (error) {
        return true; // If decoding fails, consider it expired
      }
    };

    // Function to refresh access token
    const refreshAccessToken = async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) return false;

      try {
        const response = await axios.post('http://localhost:3000/api/refresh-token', {
          refreshToken,
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return true;
      } catch (error) {
        console.error('Token refresh failed:', error);
        return false;
      }
    };

    // Validate token by making a test request
    const validateToken = async (currentToken) => {
      try {
        await axios.get('http://localhost:3000/menu', {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        });
        // Check role if required
        const userRole = localStorage.getItem('userRole');
        if (requiredRole) {
          if (userRole !== requiredRole) {
            navigate('/');
            return;
          }
        } else if (userRole === 'admin' && !['/profile', '/menu'].includes(location.pathname)) {
          navigate('/dashboard');
          return;
        }
        setIsAuthenticated(true);
      } catch (error) {
        // Token is invalid, redirect to welcome
        console.error('Token validation failed:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('sessionToken');
        localStorage.removeItem('userName');
        localStorage.removeItem('userRole');
        navigate('/welcome');
      } finally {
        setLoading(false);
      }
    };

    // Check if access token is expired and refresh if needed
    const checkAndRefreshToken = async () => {
      let currentToken = token;
      if (accessToken && isTokenExpired(accessToken)) {
        const refreshed = await refreshAccessToken();
        if (refreshed) {
          currentToken = localStorage.getItem('accessToken');
        } else {
          // Refresh failed, redirect to welcome
          localStorage.removeItem('accessToken');
          localStorage.removeItem('sessionToken');
          localStorage.removeItem('userName');
          localStorage.removeItem('userRole');
          navigate('/welcome');
          setLoading(false);
          return;
        }
      }
      validateToken(currentToken);
    };

    checkAndRefreshToken();
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
