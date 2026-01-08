import React, { useState, useEffect } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { updateUser, deleteUser } from "../../redux/authSlice";
import { useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [email, setEmail] = useState(localStorage.getItem("userEmail") || "");
  const [phone, setPhone] = useState(localStorage.getItem("userPhone") || "");
  const [role] = useState(localStorage.getItem("userRole") || "");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // Validation
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const phoneRegex = /^[0-9]{10}$/;
    setIsPhoneValid(phoneRegex.test(phone));
  }, [phone]);

  useEffect(() => {
    const passRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&]).{6,}$/;
    setIsPasswordValid(password.length === 0 || passRegex.test(password));
  }, [password]);

  const isFormValid =
    name.trim() !== "" && isEmailValid && isPhoneValid && isPasswordValid;

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;

    const userId = user._id; // Assuming user object has _id
    const updateData = { name, email, phone };
    if (password) updateData.password = password;

    try {
      await dispatch(updateUser({ id: userId, ...updateData })).unwrap();
      alert("Profile updated successfully!");
    } catch (error) {
      alert("Failed to update profile: " + error);
    }
  };

  // DELETE BUTTON ACTION
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (!confirmDelete) return;

    const userId = user._id; // Assuming user object has _id

    try {
      await dispatch(deleteUser(userId)).unwrap();
      alert("Account deleted successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      alert("Failed to delete account: " + error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] mt-20 px-4 py-8">

      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-2xl p-10 w-full max-w-lg text-white">

        <h1 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">
          Update Profile
        </h1>

        <form className="space-y-6" onSubmit={handleUpdate}>
          
          {/* NAME */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-white/20 backdrop-blur-md 
                border border-white/20 text-white placeholder-gray-300 
                focus:outline-none focus:border-blue-400 transition"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 rounded-xl bg-white/20 backdrop-blur-md 
                border ${isEmailValid ? "border-green-400" : "border-red-400"} 
                text-white placeholder-gray-300 transition`}
              placeholder="Enter your email"
              required
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Phone Number</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
              className={`w-full p-3 rounded-xl bg-white/20 backdrop-blur-md 
                border ${isPhoneValid ? "border-green-400" : "border-red-400"}
                text-white placeholder-gray-300 transition`}
              placeholder="Enter 10-digit phone number"
              required
            />
          </div>

          {/* ROLE */}
          {/* <div>
            <label className="block text-gray-200 mb-2 font-medium">Role</label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-md 
                border border-white/20 text-gray-400 cursor-not-allowed"
            />
          </div> */}

          {/* PASSWORD */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">New Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full p-3 rounded-xl bg-white/20 backdrop-blur-md 
                  border ${password.length === 0 || isPasswordValid ? "border-green-400" : "border-red-400"} 
                  text-white placeholder-gray-300 transition`}
                placeholder="Enter strong password"
              />

              <span
                className="absolute right-4 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </span>
            </div>
          </div>

          {/* SAVE CHANGES BUTTON */}
          <button
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-3 rounded-xl font-semibold shadow-lg transition
              ${isFormValid ? "bg-blue-600 hover:bg-blue-700" : "bg-gray-500 cursor-not-allowed"}`}
          >
            Save Changes
          </button>
        </form>

        {/* DELETE ACCOUNT BUTTON */}
        <button
          onClick={handleDeleteAccount}
          className="w-full mt-6 py-3 bg-red-600 hover:bg-red-700 
            transition rounded-xl text-white font-semibold shadow-lg flex items-center justify-center gap-2"
        >
          <Trash2 size={20} /> Delete Account
        </button>

      </div>
    </div>
  );
}
