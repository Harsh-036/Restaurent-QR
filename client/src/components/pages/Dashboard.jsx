import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import DashboardContent from '../dashboardContent';

const Dashboard = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Fixed Sidebar */}
      <div className="fixed left-0 top-20 w-64 h-[calc(100vh-5rem)] bg-white/10 backdrop-blur-2xl text-white shadow-xl border-r border-white/20 p-6 overflow-y-auto rounded-r-3xl">
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/table"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/table' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Table
            </Link>
          </li>
          <li>
            <Link
              to="/menu"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/menu' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Menu
            </Link>
          </li>
          <li>
            <Link
              to="/orders"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/orders' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
            >
              Orders
            </Link>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 border border-white/20">
          {/* <h1 className="text-3xl font-bold mb-6">Dashboard</h1> */}
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
