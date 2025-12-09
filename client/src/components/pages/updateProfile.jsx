import React, { useState } from "react";

export default function UpdateProfile() {
  const [name, setName] = useState(localStorage.getItem("userName") || "");
  const [role] = useState(localStorage.getItem("userRole") || "");

  const handleUpdate = (e) => {
    e.preventDefault();

    // Save new name in localStorage
    localStorage.setItem("userName", name);

    alert("Profile updated successfully!");
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] px-4 py-8">

      <div className="bg-white/10 backdrop-blur-2xl border border-white/20 
        rounded-3xl shadow-2xl p-10 w-full max-w-lg text-white">

        {/* Heading */}
        <h1 className="text-4xl font-bold text-center mb-6 drop-shadow-lg">
          Update Profile
        </h1>

        <p className="text-center text-gray-300 mb-10">
          Update your account details and keep your profile up to date.
        </p>

        {/* FORM */}
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

          {/* ROLE (READ ONLY) */}
          <div>
            <label className="block text-gray-200 mb-2 font-medium">Role</label>
            <input
              type="text"
              value={role}
              readOnly
              className="w-full p-3 rounded-xl bg-white/10 backdrop-blur-md 
                border border-white/20 text-gray-400 cursor-not-allowed"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 
              transition rounded-xl text-white font-semibold shadow-lg"
          >
            Save Changes
          </button>
        </form>

      </div>
    </div>
  );
}
