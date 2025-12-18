import React from "react";
import { ArrowRight, Sparkles, Leaf, Truck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] border-b border-white/10">
      
      {/* background glow */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* LEFT CONTENT */}
        <div className="space-y-8 text-center lg:text-left">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white">
              Premium Vegetarian Restaurant
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold text-white leading-tight">
            Taste That Feels
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
              Crafted with Care
            </span>
          </h1>

          <p className="text-gray-300 text-lg max-w-xl mx-auto lg:mx-0">
            A modern vegetarian dining experience where freshness, flavor and
            technology come together. Scan, order and enjoy — effortlessly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button
              onClick={() =>
                document.getElementById("menu-section")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
              className="group px-8 py-3 rounded-xl bg-white text-black font-semibold flex items-center justify-center gap-2 hover:scale-105 transition"
            >
              View Menu
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </button>

            <button className="px-8 py-3 rounded-xl border border-white/30 text-white hover:bg-white/10 transition">
              Reserve Table
            </button>
          </div>

          {/* features */}
          <div className="flex justify-center lg:justify-start gap-8 pt-6">
            <div className="flex items-center gap-2 text-gray-300">
              <Leaf className="w-5 h-5 text-green-400" />
              100% Veg
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Truck className="w-5 h-5 text-blue-400" />
              Fast Service
            </div>
          </div>
        </div>

        {/* RIGHT SHOWCASE */}
        <div className="relative hidden lg:flex justify-center">
          <div className="relative w-[320px] h-[420px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
            <div className="absolute -top-6 -right-6 bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-lg">
              Chef’s Special ⭐
            </div>

            <div className="w-full h-56 rounded-2xl bg-gradient-to-br from-blue-400/30 to-indigo-400/30 mb-6"></div>

            <h3 className="text-white text-xl font-semibold mb-2">
              Signature Thali
            </h3>
            <p className="text-gray-300 text-sm mb-4">
              Balanced flavors, premium ingredients, unforgettable taste.
            </p>

            <div className="flex justify-between items-center">
              <span className="text-white font-bold text-lg">₹249</span>
              <button className="px-4 py-2 bg-white text-black rounded-lg text-sm font-semibold">
                Order Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
