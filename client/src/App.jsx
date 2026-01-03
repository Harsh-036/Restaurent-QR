import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Main from "./components/Main";
import ProtectRoute from "./components/ProtectRoute";
import Welcome from "./components/Welcome";
import UpdateProfile from "./components/pages/updateProfile";
import Cart from "./components/Cart";
import ResetPassword from "./components/pages/ResetPassword";
import ForgetPassword from "./components/pages/ForgetPassword";
import Dashboard from "./components/pages/Dashboard";
import Checkout from "./components/checOutOrder";
import MenuPage from "./components/pages/MenuPage";
import OrdersPage from "./components/pages/OrdersPage";
import TablePage from "./components/pages/TablePage";
import CouponsPage from "./components/pages/CouponsPage";

const App = () => {
  return (
    <Router>
      <div>
        {/* <Navbar/> */}
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
          {/* protected cart page */}
          <Route
            path="/cart"
            element={
              <ProtectRoute>
                <Cart />
              </ProtectRoute>
            }
          />
          {/* protected menu page */}
          <Route
            path="/menu"
            element={
              <ProtectRoute>
                <MenuPage />
              </ProtectRoute>
            }
          />
          {/* protected dashboard page */}
          <Route
            path="/dashboard"
            element={
              <ProtectRoute requiredRole="admin">
                <Dashboard />
              </ProtectRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectRoute>
                <Checkout/>
              </ProtectRoute>
            }
          />
          {/* protected orders page */}
          <Route
            path="/orders"
            element={
              <ProtectRoute requiredRole="admin">
                <OrdersPage />
              </ProtectRoute>
            }
          />
          {/* protected table page */}
          <Route
            path="/table"
            element={
              <ProtectRoute requiredRole="admin">
                <TablePage />
              </ProtectRoute>
            }
          />
          {/* protected coupons page */}
          <Route
            path="/coupans"
            element={
              <ProtectRoute requiredRole="admin">
                <CouponsPage />
              </ProtectRoute>
            }
          />
          <Route path="/login" element={<Home />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/forgetpassword" element={<ForgetPassword />} />
          <Route path="/welcome" element={<Welcome />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
