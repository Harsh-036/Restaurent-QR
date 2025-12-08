import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './navbar';

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
    <div>
      <Navbar/>
    </div>
  );
};

export default Main;
