import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="fixed left-0 top-20 w-64 h-[calc(100vh-5rem)] bg-white/10 backdrop-blur-2xl text-white shadow-xl border-r border-white/20 p-6 overflow-y-auto rounded-r-3xl">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/dashboard"
            className="block py-2 px-4 rounded transition hover:bg-white/10"
          >
            Dashboard
          </Link>
        </li>
        <li>
          <Link
            to="/table"
            className="block py-2 px-4 rounded transition hover:bg-white/10"
          >
            Table
          </Link>
        </li>
        <li>
          <Link
            to="/menu"
            className="block py-2 px-4 rounded transition hover:bg-white/10"
          >
            Menu
          </Link>
        </li>
        <li>
          <Link
            to="/orders"
            className="block py-2 px-4 rounded transition hover:bg-white/10"
          >
            Orders
          </Link>
        </li>
        <li>
          <Link
            to="/coupans"
            className="block py-2 px-4 rounded transition hover:bg-white/10"
          >
            Coupans
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
