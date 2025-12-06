import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Main from './components/main'
import ProtectRoute from './components/ProtectRoute'
import Welcome from './components/Welcome'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<ProtectRoute><Main /></ProtectRoute>} />
          <Route path="/login" element={<Home />} />
          <Route path='/welcome' element={<Welcome/>}/>
        </Routes>
      </div>
    </Router>
  )
}

export default App
