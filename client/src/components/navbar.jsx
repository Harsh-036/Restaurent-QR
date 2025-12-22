import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/authSlice";
import { ShoppingCart } from "lucide-react";

const Navbar = () => {
  const userName = localStorage.getItem("userName") || "Guest";
  const userRole = localStorage.getItem("userRole") || "guest";

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cart } = useSelector((state) => state.cart);


  const cartItems = cart?.items || [];


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
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userPhone");

    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav
      className="
      fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-4
      bg-gradient-to-br from-[#0e1a35]/80 via-[#162544]/80 to-[#0e1a35]/80
      text-white shadow-xl border-b border-white/20 backdrop-blur-md
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

            <Link to="/menu" className="hover:text-blue-400 transition">
          Menu
        </Link>

        <Link to="/orders" className="hover:text-blue-400 transition">
          Orders
        </Link>
          </>
        )}

        
        <button
          className="relative p-2 text-gray-300 hover:text-white transition-colors"
          aria-label="Shopping cart"
          onClick={() => navigate("/cart")}
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {cartItems.length} 
          </span>
        </button>
      </div>

      {/* RIGHT - USER BOX with DROPDOWN or REGISTER LINK */}
      {userRole === "guest" ? (
        <div className="flex items-center space-x-4">
          {/* USER BOX */}
          <div
            className="
            flex items-center space-x-3 bg-white/10
            px-4 py-2 rounded-xl border border-white/20
            shadow-lg backdrop-blur-md
          "
          >
            <div className="text-sm w-10 leading-tight">
              <p className="font-semibold">{userName}</p>
              <p className="text-gray-300 text-xs">{userRole}</p>
            </div>
          </div>

          {/* REGISTER LINK */}
          <Link
            to="/login"
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-white font-medium transition"
          >
            Register
          </Link>
        </div>
      ) : (
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
      )}
    </nav>
  );
};

export default Navbar;
