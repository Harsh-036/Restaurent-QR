import React, { useEffect } from "react";
import axios from "axios";
import Hero from "../components/Hero";
// import Footer from "./Footer";

const dummyCategories = ["Starters", "Main Course", "Beverages", "Desserts"];

const dummyMenu = [
  {
    id: 1,
    name: "Paneer Butter Masala",
    price: 220,
    category: "Main Course",
    image: "https://via.placeholder.com/400x300?text=Paneer",
    description: "Rich tomato gravy with soft paneer cubes",
  },
  {
    id: 2,
    name: "Veg Hakka Noodles",
    price: 180,
    category: "Main Course",
    image: "https://via.placeholder.com/400x300?text=Noodles",
    description: "Wok tossed noodles with fresh vegetables",
  },
  {
    id: 3,
    name: "Cold Coffee",
    price: 120,
    category: "Beverages",
    image: "https://via.placeholder.com/400x300?text=Coffee",
    description: "Chilled creamy coffee topped with foam",
  },
];

const Main = () => {
  const accessToken = localStorage.getItem("accessToken");
  const sessionToken = localStorage.getItem("sessionToken");
  const token = accessToken || sessionToken;

  useEffect(() => {
    if (token) {
      axios.get("http://localhost:3000/menu", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }, [token]);

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

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-3">
          {dummyCategories.map((cat) => (
            <button
              key={cat}
              className="px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-sm hover:bg-white/20 transition"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {dummyMenu.map((item) => (
            <div
              key={item.id}
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

                <button className="w-full mt-3 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-gray-100 transition">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

// Footer
//  <Footer/> 

export default Main;
