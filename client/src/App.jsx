import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './components/Home'
import Main from './components/main'
import ProtectRoute from './components/ProtectRoute'

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          <Route path='/' element={<ProtectRoute><Main /></ProtectRoute>} />
          <Route path="/login" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
