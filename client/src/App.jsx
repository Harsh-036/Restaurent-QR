
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import ProtectRoute from "./components/ProtectRoute";
import Welcome from "./components/Welcome";
import UpdateProfile from "./components/pages/updateProfile";

const App = () => {
  return (
    <Router>
      <div>
        <Routes>
          {/*  protected main page */}
          <Route
            path="/"
            element={
              <ProtectRoute>
                <Main />
              </ProtectRoute>
            }
          />
          {/* protected update page */}
          <Route
            path="/profile"
            element={
              <ProtectRoute>
                <UpdateProfile />
              </ProtectRoute>
            }
          />
          <Route path="/login" element={<Home />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
