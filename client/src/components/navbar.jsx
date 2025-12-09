import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const userName = localStorage.getItem("userName") || "Guest";
  const userRole = localStorage.getItem("userRole") || "guest";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout Function
  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    localStorage.removeItem("sessionToken");
    localStorage.removeItem("accessToken");

    navigate("/login");
  };

  return (
    <nav
      className="
      flex justify-between items-center px-8 py-4 
      bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35]
      text-white shadow-xl border-b border-white/20
    "
    >
      {/* LEFT - LOGO */}
      <div className="text-2xl font-extrabold tracking-wide drop-shadow-md">
        <Link to="/">Restaurant QR</Link>
      </div>

      {/* MIDDLE - NAV LINKS */}
      <div className="hidden md:flex space-x-10 text-lg font-medium">
        {userRole === "admin" && (
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

      {/* RIGHT - USER BOX with DROPDOWN */}
      <div
        ref={dropdownRef}
        className="relative cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        {/* USER BOX */}
        <div
          className="
          flex items-center space-x-3 bg-white/10 
          px-4 py-2 rounded-xl border border-white/20 
          shadow-lg backdrop-blur-md
        "
        >
          <div className="text-sm leading-tight">
            <p className="font-semibold">{userName}</p>
            <p className="text-gray-300 text-xs">{userRole}</p>
          </div>

          {/* Small Arrow */}
          <span className="text-xs opacity-70">▼</span>
        </div>

        {/* DROPDOWN */}
        {open && (
          <div
            className="
            absolute right-0 mt-2 w-40 
            bg-white text-black rounded-lg shadow-xl 
            py-2 z-50 border border-gray-200
            animate-fadeIn
          "
          >
            <Link
              to="/profile"
              className="block px-4 py-2 text-sm hover:bg-gray-100"
            >
              Update Profile
            </Link>

            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
