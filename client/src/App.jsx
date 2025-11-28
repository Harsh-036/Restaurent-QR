import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/login'
import Signup from './components/signup'
import Navbar from './components/navbar'

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<div>Welcome to Restaurent QR</div>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
