import React from "react";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Clock,
  Leaf,
  Truck
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-[#0e1a35] via-[#162544] to-[#0e1a35] border-t border-white/10">
      {/* Top Highlight Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center gap-2">
            <Leaf className="w-6 h-6 text-green-400" />
            <p className="text-white font-bold text-lg">100% Vegetarian</p>
            <p className="text-gray-300 text-sm">Fresh & hygienic ingredients</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Truck className="w-6 h-6 text-blue-400" />
            <p className="text-white font-bold text-lg">Fast Service</p>
            <p className="text-gray-300 text-sm">Quick dine-in & takeaway</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Utensils className="w-6 h-6 text-indigo-400" />
            <p className="text-white font-bold text-lg">Premium Quality</p>
            <p className="text-gray-300 text-sm">Trusted since 2015</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 rounded-xl bg-white/10 backdrop-blur">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-wide">Restaurant QR</h2>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6 text-base">
            Experience modern vegetarian dining with our innovative QR ordering system.
            Fresh ingredients, authentic flavors, and seamless service.
          </p>
          <div className="flex gap-4">
            <a className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110" href="#">
              <Instagram className="w-5 h-5 text-white" />
            </a>
            <a className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-300 hover:scale-110" href="#">
              <Facebook className="w-5 h-5 text-white" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-bold text-xl mb-6">Quick Links</h3>
          <ul className="space-y-3">
            <li>
              <a href="/" className="text-gray-300 hover:text-white transition-colors text-base hover:translate-x-1 inline-block transform duration-200">
                Home
              </a>
            </li>
            <li>
              <a href="/menu" className="text-gray-300 hover:text-white transition-colors text-base hover:translate-x-1 inline-block transform duration-200">
                Our Menu
              </a>
            </li>
            <li>
              <a href="/cart" className="text-gray-300 hover:text-white transition-colors text-base hover:translate-x-1 inline-block transform duration-200">
                Cart
              </a>
            </li>
            <li>
              <a href="/myorders" className="text-gray-300 hover:text-white transition-colors text-base hover:translate-x-1 inline-block transform duration-200">
                My Orders
              </a>
            </li>
          </ul>
        </div>

        {/* Location & Hours */}
        <div>
          <h3 className="text-white font-bold text-xl mb-6">Visit Us</h3>
          <div className="flex items-start gap-4 mb-6">
            <div className="p-2 rounded-lg bg-white/10">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-gray-300 text-base leading-relaxed">
                2nd Floor, City Center Mall<br />
                Jaipur, Rajasthan 302001
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-white/10">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-white font-semibold text-base mb-1">Opening Hours</p>
              <p className="text-gray-300 text-sm">Mon - Sun: 11:00 AM – 11:30 PM</p>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-bold text-xl mb-6">Get in Touch</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Phone className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">+91 98765 43210</p>
                <p className="text-gray-400 text-sm">Call for reservations</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-white/10">
                <Mail className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">hello@restaurantqr.com</p>
                <p className="text-gray-400 text-sm">Email us anytime</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-base">
            © {new Date().getFullYear()} Restaurant QR. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Crafted with ❤️ for modern dining experiences
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;