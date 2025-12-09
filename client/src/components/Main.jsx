import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
  const accessToken = localStorage.getItem('accessToken');
  const sessionToken = localStorage.getItem('sessionToken');
  const token = accessToken || sessionToken;

  // console.log('Access Token:', accessToken);
  // console.log('Session Token:', sessionToken);

  useEffect(() => {
    if (token) {
      axios.get('http://localhost:3000/menu', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token]);


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Welcome to Restaurant QR System
        </h1>
        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
          <p className="text-white text-center text-lg">
            Use the navigation menu to access different features of the restaurant management system.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Main;
