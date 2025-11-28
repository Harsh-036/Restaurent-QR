import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-xl font-bold">
        <Link to='/'>Restaurent QR</Link> 
      </div>
      <div className="flex space-x-4">
        <Link to="/login" className="text-blue-500 hover:text-blue-700">Login</Link>
        <Link to="/signup" className="text-blue-500 hover:text-blue-700">Signup</Link>
      </div>
    </nav>
  );
};

export default Navbar;
