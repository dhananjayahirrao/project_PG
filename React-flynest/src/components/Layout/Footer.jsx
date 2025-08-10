
import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-slate-900/50 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
              >
                <Plane className="h-6 w-6 text-white" />
              </motion.div>
              <span className="text-xl font-bold gradient-text">Flynest</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner for seamless flight booking and travel management.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <span className="text-white font-semibold">Quick Links</span>
            <div className="flex flex-col space-y-2">
              <Link to="/about" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                About Us
              </Link>
              <Link to="/flights" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Flight Status
              </Link>
              <Link to="/bookings" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                My Bookings
              </Link>
              <Link to="/payments" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Payment History
              </Link>
              <Link to="/support" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Support
              </Link>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <span className="text-white font-semibold">Services</span>
            <div className="flex flex-col space-y-2">
              <Link to="/flights" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Flight Booking
              </Link>
              <Link to="/travel-guide" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Travel Guide
              </Link>
              <Link to="/insurance" className="text-gray-400 hover:text-white transition-colors cursor-pointer text-sm">
                Travel Insurance
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <span className="text-white font-semibold">Contact</span>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Mail className="h-4 w-4" />
                <span>support@flynest.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Phone className="h-4 w-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <MapPin className="h-4 w-4" />
                <span>123 Aviation St, Sky City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2025 Flynest. All rights reserved. Built with ❤️ for travelers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
