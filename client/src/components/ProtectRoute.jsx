import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');
  const sessionToken = localStorage.getItem('sessionToken');

  if (!accessToken && !sessionToken) {
    // Redirect to Home page (/login) if both tokens are missing
    return <Navigate to="/login" replace />;
  }

  // If either token exists, render the protected content
  return children ? children : <Outlet />;
};

export default ProtectRoute;
