import React from "react";
import {
  Utensils,
  MapPin,
  Phone,
  Mail,
  Instagram,
  Facebook,
  Clock
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0e1a35] via-[#162544] to-[#0e1a35] text-gray-300">
      {/* Top Highlight Strip */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-white font-semibold">Freshly Cooked</p>
            <p className="text-xs text-gray-400">Made after every order</p>
          </div>
          <div>
            <p className="text-white font-semibold">Fast Service</p>
            <p className="text-xs text-gray-400">Quick dine-in & takeaway</p>
          </div>
          <div>
            <p className="text-white font-semibold">Trusted Since 2015</p>
            <p className="text-xs text-gray-400">Loved by thousands</p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-white/10">
              <Utensils className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-white">SavoryBites</h2>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            A modern vegetarian restaurant serving quality food with rich taste,
            hygienic preparation, and consistent service.
          </p>
          <div className="flex gap-4 mt-5">
            <a className="hover:text-white transition" href="#">
              <Instagram size={18} />
            </a>
            <a className="hover:text-white transition" href="#">
              <Facebook size={18} />
            </a>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="text-white font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white cursor-pointer">Home</li>
            <li className="hover:text-white cursor-pointer">Menu</li>
            <li className="hover:text-white cursor-pointer">Book Table</li>
            <li className="hover:text-white cursor-pointer">Offers</li>
            <li className="hover:text-white cursor-pointer">Contact</li>
          </ul>
        </div>

        {/* Locations */}
        <div>
          <h3 className="text-white font-semibold mb-4">Location</h3>
          <div className="flex items-start gap-3 text-sm">
            <MapPin className="w-4 h-4 mt-1" />
            <p className="text-gray-400">
              2nd Floor, City Center Mall<br />
              Jaipur, Rajasthan
            </p>
          </div>
          <div className="flex items-start gap-3 text-sm mt-3">
            <Clock className="w-4 h-4 mt-1" />
            <p className="text-gray-400">11:00 AM – 11:30 PM</p>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-white font-semibold mb-4">Get in Touch</h3>
          <div className="flex items-center gap-3 text-sm mb-3">
            <Phone className="w-4 h-4" />
            <span>+91 98765 43210</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail className="w-4 h-4" />
            <span>support@savorybites.com</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-5 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} SavoryBites · Crafted for modern dining experience
      </div>
    </footer>
  );
};

export default Footer;