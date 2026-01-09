import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchMenu, createMenu, updateMenu, deleteMenu, toggleAvailability, addMenu, updateMenuAction, removeMenu, updateMenuAvailability } from "../../redux/menuSlice";
import Sidebar from "../Sidebar";
import socketService from "../../lib/socket";

const MenuPage = () => {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { items: menuItems = [], categories: allCategories = [], pagination, loading, error } = useSelector((state) => state.menu);
  const { user } = useSelector((state) => state.auth);
  const userRole = localStorage.getItem('userRole');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Admin controls state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: null
  });

  useEffect(() => {
    dispatch(fetchMenu({ page: currentPage, category: selectedCategory }));
  }, [dispatch, currentPage, selectedCategory]);

  // WebSocket connection and event listeners
  useEffect(() => {
    socketService.connect();

    // Listen for menu events
    socketService.onMenuCreated((newMenu) => {
      dispatch(addMenu(newMenu));
    });

    socketService.onMenuUpdated((updatedMenu) => {
      dispatch(updateMenuAction(updatedMenu));
    });

    socketService.onMenuDeleted((deletedMenuId) => {
      dispatch(removeMenu(deletedMenuId));
    });

    socketService.onMenuAvailabilityChanged((updatedMenu) => {
      dispatch(updateMenuAvailability(updatedMenu));
    });

    // Cleanup on unmount
    return () => {
      socketService.off('menu:created');
      socketService.off('menu:updated');
      socketService.off('menu:deleted');
      socketService.off('menu:availabilityChanged');
    };
  }, [dispatch]);

  // Use categories from Redux
  const categories = allCategories;

  // Menu items are already filtered by category on backend, so use menuItems directly
  const filteredItems = menuItems;

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('category', formData.category);
    if (formData.image) {
      data.append('image', formData.image);
    }

    if (showCreateModal) {
      await dispatch(createMenu({ formData: data }));
    } else if (showEditModal && editingItem) {
      await dispatch(updateMenu({ id: editingItem._id, formData: data }));
    }

    setShowCreateModal(false);
    setShowEditModal(false);
    setFormData({ name: '', description: '', price: '', category: '', image: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] text-white mt-20">
      {/* Fixed Sidebar */}
      <Sidebar/>

      {/* Main Content */}
      <div className="ml-64 p-6 flex justify-center items-start min-h-screen">
        <div className="w-full max-w-6xl">
          {/* MENU SECTION */}
          <section
            id="menu-section"
            className="space-y-12"
          >


        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            Explore Our Menu
          </h2>
          <p className="text-gray-300">
            Freshly prepared vegetarian dishes crafted with love
          </p>
          {/* Admin Create Button */}
          {userRole === 'admin' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Create Menu Item
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <p className="text-white mt-2">Loading menu...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center">
            <p className="text-red-400">Error loading menu: {error}</p>
            <button
              onClick={() => dispatch(fetchMenu())}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Categories */}
        {!loading && !error && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3">
            <button
              key="all"
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={`px-5 py-2 rounded-full border text-sm transition ${
                selectedCategory === null
                  ? "bg-white text-black border-white"
                  : "bg-white/10 border-white/20 text-white hover:bg-white/20"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setCurrentPage(1);
                }}
                className={`px-5 py-2 rounded-full border text-sm transition ${
                  selectedCategory === cat
                    ? "bg-white text-black border-white"
                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Menu Cards */}
        {!loading && !error && filteredItems.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredItems.map((item) => (
                <div
                  key={item._id}
                  className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden hover:scale-[1.02] transition-transform"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-48 w-full object-cover"
                  />

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-white">
                        {item.name}
                      </h3>
                      <span className="text-white font-bold">
                        ₹{item.price}
                      </span>
                    </div>

                    <p className="text-gray-300 text-sm">
                      {item.description}
                    </p>

                    {/* Admin Controls */}
                    {userRole === 'admin' && (
                      <div className="flex gap-2 mb-2">
                        <button
                          onClick={() => {
                            setEditingItem(item);
                            setFormData({
                              name: item.name,
                              description: item.description,
                              price: item.price,
                              category: item.category,
                              image: null
                            });
                            setShowEditModal(true);
                          }}
                          className="flex-1 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => dispatch(deleteMenu(item._id))}
                          className="flex-1 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => dispatch(toggleAvailability(item._id))}
                          className={`flex-1 px-3 py-1 rounded text-sm transition ${
                            item.isAvailable
                              ? 'bg-yellow-600 hover:bg-yellow-700'
                              : 'bg-green-600 hover:bg-green-700'
                          } text-white`}
                        >
                          {item.isAvailable ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    currentPage === 1
                      ? "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  Previous
                </button>

                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded-lg border text-sm transition ${
                      page === currentPage
                        ? "bg-white text-black border-white"
                        : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className={`px-4 py-2 rounded-lg border text-sm transition ${
                    currentPage === pagination.totalPages
                      ? "bg-gray-600 text-gray-400 border-gray-500 cursor-not-allowed"
                      : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Menu Items */}
        {!loading && !error && filteredItems.length === 0 && menuItems.length > 0 && (
          <div className="text-center">
            <p className="text-gray-300">No items found in this category.</p>
          </div>
        )}

        {/* No Menu Items Overall */}
        {!loading && !error && menuItems.length === 0 && (
          <div className="text-center">
            <p className="text-gray-300">No menu items available.</p>
          </div>
        )}

        {/* Create/Edit Modal */}
        {(showCreateModal || showEditModal) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h3 className="text-xl font-bold mb-4 text-black">
                {showCreateModal ? 'Create Menu Item' : 'Edit Menu Item'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    rows="3"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    required={showCreateModal}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    {showCreateModal ? 'Create' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateModal(false);
                      setShowEditModal(false);
                      setFormData({ name: '', description: '', price: '', category: '', image: null });
                    }}
                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MenuPage;
