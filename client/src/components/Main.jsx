import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Main = () => {
  console.log(localStorage.getItem('accessToken'));
  useEffect(() => {
    axios.get('http://localhost:3000/menu', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  }, []);


  return (
    <div>
      <h1>Main Page</h1>
    </div>
  );
};

export default Main;
