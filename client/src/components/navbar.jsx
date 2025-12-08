import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const userName = localStorage.getItem("userName") || "Guest";
  const userRole = localStorage.getItem("userRole") || "guest";

  return (
    <nav className="
      flex justify-between items-center px-8 py-4 
      bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35]
      text-white shadow-xl border-b border-white/20
    ">

      {/* LEFT - LOGO */}
      <div className="text-2xl font-extrabold tracking-wide drop-shadow-md">
        <Link to="/">Restaurant QR</Link>
      </div>

      {/* MIDDLE - NAV LINKS */}
      <div className="hidden md:flex space-x-10 text-lg font-medium">
        {localStorage.getItem('userRole') === 'admin' && (
          <>
            <Link to="/dashboard" className="hover:text-blue-400 transition">
              Dashboard
            </Link>

            <Link to="/table" className="hover:text-blue-400 transition">
              Table
            </Link>
          </>
        )}

        <Link to="/menu" className="hover:text-blue-400 transition">
          Menu
        </Link>

        <Link to="/orders" className="hover:text-blue-400 transition">
          Orders
        </Link>
      </div>

      {/* RIGHT - USER INFO */}
      <div className="
        flex items-center space-x-3 bg-white/10 
        px-4 py-2 rounded-xl border border-white/20 
        shadow-lg backdrop-blur-md
      ">
        <div className="text-sm leading-tight">
          <p className="font-semibold">{userName}</p>
          <p className="text-gray-300 text-xs">{userRole}</p>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
