import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginUser, signupUser, googleSignIn } from '../redux/authSlice';
import { migrateCart } from '../redux/cartSlice';
import toast from 'react-hot-toast';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';

const Home = () => {
  const location = useLocation();
  const [isSignup, setIsSignup] = useState(location.state?.showSignup || false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
  });
  const [loginAlertShown, setLoginAlertShown] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, refreshTokenExpiry } = useSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated && refreshTokenExpiry) {
      const message = isSignup ? "Signup successful!" : `Login successful! ${refreshTokenExpiry}`;
      toast.success(message);
      const userRole = localStorage.getItem('userRole');
      const redirectPath = userRole === 'admin' ? '/dashboard' : (location.state?.fromCart ? '/cart' : '/');

      // If coming from cart (guest signup) or if sessionToken exists, dispatch migrateCart before navigating
      const sessionToken = localStorage.getItem('sessionToken');
      if ((location.state?.fromCart || sessionToken) && sessionToken) {
        const sessionId = localStorage.getItem('sessionId');
        dispatch(migrateCart({ sessionId })).then(() => {
          navigate(redirectPath);
        });
      } else {
        navigate(redirectPath);
      }
    }
  }, [isAuthenticated, navigate, isSignup, refreshTokenExpiry, dispatch, location.state]);

  React.useEffect(() => {
    if (error) {
      toast.error(
        isSignup
          ? "Signup failed. Please re-enter details."
          : "Login failed. Please re-enter email and password."
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        phoneNumber: "",
      });
    }
  }, [error, isSignup]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isSignup) {
      dispatch(
        signupUser({
          name: formData.name,
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
        })
      );
    } else {
      dispatch(loginUser({ email: formData.email, password: formData.password }));
    }
  };

  const toggleForm = () => {
    setIsSignup(!isSignup);
    setFormData({ name: "", email: "", password: "", phoneNumber: "" });
  };

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      dispatch(googleSignIn({ idToken }));
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white">

      {/* LEFT SECTION */}
      <div className="hidden md:flex w-1/2 flex-col justify-center px-16">
        <div className="max-w-lg">
          <img
            src="/vite.svg"
            alt="Restaurant Logo"
            className="h-24 w-24 mb-8 bg-white/10 p-4 rounded-full shadow-xl backdrop-blur-md"
          />

          <h1 className="text-5xl font-extrabold leading-snug drop-shadow-lg">
            Restaurant QR System
          </h1>

          <p className="text-gray-300 mt-6 text-lg leading-relaxed">
            A modern digital menu and ordering system. Browse, order, and enjoy a seamless
            dining experience with our QR-based restaurant solution.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION (FORM) */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20">

          <h2 className="text-3xl font-bold text-center mb-3">
            {isSignup ? "Create Your Account" : "Welcome Back"}
          </h2>

          <p className="text-gray-300 text-center mb-8 text-sm">
            {isSignup
              ? "Sign up to access the digital dining experience"
              : "Login to continue your dining journey"}
          </p>

          {/* GOOGLE SIGN-IN BUTTON */}
          {!isSignup && (
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-3 bg-white hover:bg-gray-100 transition rounded-xl text-gray-800 font-semibold shadow-lg flex items-center justify-center mb-4"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {isSignup && (
              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="John Doe"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm mb-1 text-gray-200">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-gray-200">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm mb-1 text-gray-200">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-semibold shadow-lg disabled:opacity-50"
            >
              {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
            </button>
          </form>

          {/* FORGOT PASSWORD LINK (only show in login mode) */}
          {!isSignup && (
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/resetpassword')}
                className="text-blue-400 hover:text-blue-300 transition text-sm"
              >
                Forgot Password?
              </button>
            </div>
          )}

          {/* SWITCH FORM */}
          <div className="mt-8 text-center">
            <button
              onClick={toggleForm}
              className="text-blue-400 hover:text-blue-300 transition text-sm"
            >
              {isSignup
                ? "Already have an account? Login"
                : "Don’t have an account? Create Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
