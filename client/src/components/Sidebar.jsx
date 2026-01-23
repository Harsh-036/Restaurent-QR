import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-20 h-[calc(100vh-5rem)] bg-white/10 backdrop-blur-2xl text-white shadow-xl border-r border-white/20 p-6 overflow-y-auto rounded-r-3xl transition-transform duration-300 z-50 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64`}>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/dashboard' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={onClose}
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
              onClick={onClose}
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
              onClick={onClose}
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
              onClick={onClose}
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/coupans"
              className={`block py-2 px-4 rounded transition ${
                location.pathname === '/coupans' ? 'bg-white/20' : 'hover:bg-white/10'
              }`}
              onClick={onClose}
            >
              Coupans
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Sidebar;
