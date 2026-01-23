import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from '../Sidebar';
import DashboardContent from '../dashboardContent';

const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className="md:hidden fixed top-24 left-4 z-30 p-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-lg text-white"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <div className="md:ml-64 p-4 md:p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-10 border border-white/20">
          {/* <h1 className="text-3xl font-bold mb-6">Dashboard</h1> */}
          <DashboardContent />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
