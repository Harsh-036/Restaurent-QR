import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTables, createTable, updateTable as updateTableThunk, toggleTableStatus, deleteTable, addTable, updateTableAction, removeTable, updateTableStatus } from '../../redux/tableSlice';
import Sidebar from '../Sidebar';
import socketService from "../../lib/socket";


const TablePage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dispatch = useDispatch();
  const { tables, loading, error } = useSelector((state) => state.table);
  const [editingTable, setEditingTable] = useState(null);
  const [editForm, setEditForm] = useState({ tableNumber: '', capacity: '' });
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState({ tableNumber: '', capacity: '' });

  useEffect(() => {
    dispatch(fetchTables());
  }, [dispatch]);

  // WebSocket connection and event listeners
  useEffect(() => {
    socketService.connect();

    // Listen for table events
    socketService.onTableCreated((newTable) => {
      dispatch(addTable(newTable));
    });

    socketService.onTableUpdated((updatedTable) => {
      dispatch(updateTableAction(updatedTable));
    });

    socketService.onTableDeleted((deletedTableId) => {
      dispatch(removeTable(deletedTableId));
    });

    socketService.onTableStatusChanged((updatedTable) => {
      dispatch(updateTableStatus(updatedTable));
    });

    // Cleanup on unmount
    return () => {
      socketService.off('table:created');
      socketService.off('table:updated');
      socketService.off('table:deleted');
      socketService.off('table:statusChanged');
    };
  }, [dispatch]);

  const getStatusColor = (isActive) => {
    return isActive ? 'text-green-400' : 'text-red-400';
  };

  const handleEditClick = (table) => {
    setEditingTable(table._id);
    setEditForm({ tableNumber: table.tableNumber, capacity: table.capacity });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateTableThunk({ id: editingTable, ...editForm })).unwrap();
      setEditingTable(null);
      setEditForm({ tableNumber: '', capacity: '' });
      dispatch(fetchTables()); // Refresh the list
    } catch (error) {
      console.error('Failed to update table:', error);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      await dispatch(toggleTableStatus(id)).unwrap();
    } catch (error) {
      console.error('Failed to toggle table status:', error);
    }
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(createTable(createForm)).unwrap();
      setShowCreateForm(false);
      setCreateForm({ tableNumber: '', capacity: '' });
    } catch (error) {
      console.error('Failed to create table:', error);
    }
  };

  const handleDeleteClick = async (id) => {
    if (window.confirm('Are you sure you want to delete this table?')) {
      try {
        await dispatch(deleteTable(id)).unwrap();
      } catch (error) {
        console.error('Failed to delete table:', error);
      }
    }
  };

  const handleDownloadQR = (table) => {
    const link = document.createElement('a');
    link.href = table.qrImage;
    link.download = `table-${table.tableNumber}-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
        <div className="w-full max-w-6xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-white">All Tables</h1>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white font-medium transition"
            >
              Create New Table
            </button>
          </div>

          {/* Create Form */}
          {showCreateForm && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">Create New Table</h2>
              <form onSubmit={handleCreateSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Table Number</label>
                  <input
                    type="number"
                    value={createForm.tableNumber}
                    onChange={(e) => setCreateForm({ ...createForm, tableNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-300 text-sm mb-2">Capacity</label>
                  <input
                    type="number"
                    value={createForm.capacity}
                    onChange={(e) => setCreateForm({ ...createForm, capacity: e.target.value })}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition"
                  >
                    Create Table
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateForm(false);
                      setCreateForm({ tableNumber: '', capacity: '' });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg">Loading tables...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-400 text-lg">Error: {error}</p>
          </div>
        )}

        {/* Tables Grid */}
        {!loading && !error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tables.map((table) => (
              <div
                key={table.tableNumber}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 hover:border-blue-500 transition"
              >
                {editingTable === table._id ? (
                  <form onSubmit={handleEditSubmit} className="mb-4">
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm mb-2">Table Number</label>
                      <input
                        type="number"
                        value={editForm.tableNumber}
                        onChange={(e) => setEditForm({ ...editForm, tableNumber: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-300 text-sm mb-2">Capacity</label>
                      <input
                        type="number"
                        value={editForm.capacity}
                        onChange={(e) => setEditForm({ ...editForm, capacity: e.target.value })}
                        className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
                        required
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg text-white text-sm font-medium transition"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingTable(null)}
                        className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        Table {table.tableNumber}
                      </h3>
                      <p className="text-gray-300">Capacity: {table.capacity}</p>
                    </div>
                    <div className="text-right">
                      <button
                        onClick={() => handleToggleStatus(table._id)}
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium transition ${
                          table.isActive
                            ? 'bg-green-600 hover:bg-green-700 text-white'
                            : 'bg-red-600 hover:bg-red-700 text-white'
                        }`}
                      >
                        {table.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-gray-300 text-sm mb-2">
                    <span className="font-medium">QR Slug:</span> {table.qrSlug}
                  </p>
                  <p className="text-gray-300 text-sm mb-4">
                    <span className="font-medium">QR URL:</span> {table.qrCodeURL}
                  </p>
                </div>

                {/* QR Code Image */}
                <div className="bg-white/5 rounded-lg p-4 mb-4">
                  {table.qrImage ? (
                    <img src={table.qrImage} alt={`QR Code for Table ${table.tableNumber}`} className="w-full h-32 object-contain" />
                  ) : (
                    <div className="w-full h-32 bg-gray-600 rounded flex items-center justify-center">
                      <span className="text-gray-400 text-sm">QR Code Image</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(table)}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white text-sm font-medium transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDownloadQR(table)}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-white text-sm font-medium transition"
                  >
                    Download QR
                  </button>
                  <button
                    onClick={() => handleDeleteClick(table._id)}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white text-sm font-medium transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && !error && tables.length === 0 && (
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
