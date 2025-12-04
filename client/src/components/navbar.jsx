import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-md">
      <div className="text-xl font-bold">
        <Link to='/'>Restaurent QR</Link>
      </div>
    </nav>
  );
};

export default Navbar;
