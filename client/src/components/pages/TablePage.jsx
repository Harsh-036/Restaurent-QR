import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../Sidebar';

const TablePage = () => {
  const navigate = useNavigate();

  // Dummy table data based on table model
  const dummyTables = [
    {
      tableNumber: 1,
      capacity: 4,
      isActive: true,
      qrSlug: 'abc123def456',
      qrCodeURL: 'http://192.168.1.100:5173/scan-qr?qr=abc123def456',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Placeholder QR image
    },
    {
      tableNumber: 2,
      capacity: 6,
      isActive: true,
      qrSlug: 'def789ghi012',
      qrCodeURL: 'http://192.168.1.100:5173/scan-qr?qr=def789ghi012',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Placeholder QR image
    },
    {
      tableNumber: 3,
      capacity: 2,
      isActive: false,
      qrSlug: 'jkl345mno678',
      qrCodeURL: 'http://192.168.1.100:5173/scan-qr?qr=jkl345mno678',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Placeholder QR image
    },
    {
      tableNumber: 4,
      capacity: 8,
      isActive: true,
      qrSlug: 'pqr901stu234',
      qrCodeURL: 'http://192.168.1.100:5173/scan-qr?qr=pqr901stu234',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Placeholder QR image
    },
    {
      tableNumber: 5,
      capacity: 4,
      isActive: true,
      qrSlug: 'vwx567yz890',
      qrCodeURL: 'http://192.168.1.100:5173/scan-qr?qr=vwx567yz890',
      qrImage: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...', // Placeholder QR image
    },
  ];

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-400' : 'text-red-400';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Fixed Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="ml-64 p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">
          <h1 className="text-4xl font-bold text-white mb-8">All Tables</h1>

        {/* Tables Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dummyTables.map((table) => (
            <div
              key={table.tableNumber}
              className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-blue-500 transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Table {table.tableNumber}
                  </h3>
                  <p className="text-gray-300">Capacity: {table.capacity}</p>
                </div>
                <div className="text-right">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(table.isActive)} bg-white/10`}>
                    {table.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="text-gray-300 text-sm mb-2">
                  <span className="font-medium">QR Slug:</span> {table.qrSlug}
                </p>
                <p className="text-gray-300 text-sm mb-4">
                  <span className="font-medium">QR URL:</span> {table.qrCodeURL}
                </p>
              </div>

              {/* QR Code Placeholder */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="w-full h-32 bg-gray-600 rounded flex items-center justify-center">
                  <span className="text-gray-400 text-sm">QR Code Image</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition">
                  Edit
                </button>
                <button className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {dummyTables.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">No tables found.</p>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default TablePage;
