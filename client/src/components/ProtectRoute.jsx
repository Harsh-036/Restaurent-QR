import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectRoute = ({ children }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (!accessToken) {
    // Redirect to Home page (/login) if token is missing
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the protected content
  return children ? children : <Outlet />;
};

export default ProtectRoute;
