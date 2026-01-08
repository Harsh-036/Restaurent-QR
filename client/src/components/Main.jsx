import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMenu } from "../redux/menuSlice";
import { addToCart } from "../redux/cartSlice";
import Hero from "../components/Hero";
// import Footer from "./Footer";

const Main = () => {
  const dispatch = useDispatch();
  const { items: menuItems = [], categories: allCategories = [], pagination, loading, error } = useSelector((state) => state.menu);
  const { user } = useSelector((state) => state.auth);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchMenu({ page: currentPage, category: selectedCategory }));
  }, [dispatch, currentPage, selectedCategory]);

  // Use categories from Redux
  const categories = allCategories;

  // Menu items are already filtered by category on backend, so use menuItems directly
  const filteredItems = menuItems;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35]">

      {/* HERO */}
      <Hero />

      {/* MENU SECTION */}
      <section
        id="menu-section"
        className="max-w-7xl mx-auto px-6 py-20 space-y-12"
      >
        {/* Header */}
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-3">
            Explore Our Menu
          </h2>
          <p className="text-gray-300">
            Freshly prepared vegetarian dishes crafted with love
          </p>
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

                    {item.isAvailable ? (
                      <button
                        onClick={() => dispatch(addToCart({ menuItemId: item._id, quantity: 1 }))}
                        className="w-full mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition"
                      >
                        Add to Cart
                      </button>
                    ) : (
                      <div className="w-full mt-3 px-4 py-2 bg-gray-600 text-gray-300 rounded-lg font-medium text-center">
                        Currently Unavailable
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
      </section>
    </div>
  );
};

// Footer
//  <Footer/> 

export default Main;
