import { session } from "@/redux/guestSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function Welcome() {
   const navigate = useNavigate();
const dispatch = useDispatch()
const { sessionToken } = useSelector((state) => state.guest);

  const handleContinueAsGuest = () => {
    dispatch(session({deviceId : 'dfkdfds' , qrSlug : "ac34a3448e32"}))
    localStorage.setItem('userName', 'User');
    localStorage.setItem('userRole', 'guest');
  };

  useEffect(() => {
    if (sessionToken) {
      navigate('/');
    }
  }, [sessionToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white">

      {/* CARD */}
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 px-14 text-center max-w-lg border border-white/20">

        {/* Logo */}
        <img 
          src="/vite.svg" 
          alt="Restaurant Logo" 
          className="w-24 h-24 mx-auto mb-6 bg-white/10 p-4 rounded-full shadow-xl backdrop-blur-md"
        />

        {/* Heading */}
        <h1 className="text-4xl font-extrabold leading-snug mb-3 drop-shadow-lg">
          Restaurant QR System
        </h1>

        {/* Subtext */}
        <p className="text-gray-300 text-sm leading-relaxed mb-10">
          A modern digital menu and ordering solution.  
          Browse menu, scan QR, order fast — enjoy a seamless dining experience.
        </p>

        {/* Buttons */}
        <div className="space-y-4">

          <Link
            to="/login"
            className="block w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold shadow-lg"
          >
            Login
          </Link>

          <Link
            to="/login"
            className="block w-full py-3 bg-white/20 hover:bg-white/30 transition rounded-xl font-semibold text-white shadow-lg backdrop-blur-md border border-white/20"
          >
            Sign Up
          </Link>

          <button
            onClick={handleContinueAsGuest}
            className="block w-full py-3 border border-white/40 rounded-xl text-gray-200 hover:bg-white/10 transition font-medium shadow-md"
          >
            Continue as Guest
          </button>

        </div>

      </div>
    </div>
  );
}
