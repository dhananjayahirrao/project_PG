
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, User, LogOut, Settings, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"
            >
              <Plane className="h-6 w-6 text-white" />
            </motion.div>
            <span className="text-xl font-bold gradient-text">Flynest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-white hover:text-blue-400 transition-colors">
                  Dashboard
                </Link>
                <Link to="/flights" className="text-white hover:text-blue-400 transition-colors">
                  Flights
                </Link>
                <Link to="/bookings" className="text-white hover:text-blue-400 transition-colors">
                  My Bookings
                </Link>
                {isAdmin() && (
                  <Link to="/admin/dashboard" className="text-orange-400 hover:text-orange-300 transition-colors">
                    Admin Panel
                  </Link>
                )}
                
                {/* User Menu */}
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 text-white">
                    <User className="h-4 w-4" />
                    <span className="text-sm">{user?.name || user?.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-white hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login">
                  <Button variant="ghost" className="text-white hover:text-blue-400">
                    Login
                  </Button>
                </Link>
                <Link to="/admin-login">
                  <Button variant="ghost" className="text-white hover:text-orange-400 border border-orange-400/30">
                    Admin
                  </Button>
                </Link>
                <Link to="/register">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 py-4"
          >
            {isAuthenticated ? (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/dashboard"
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/flights"
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Flights
                </Link>
                <Link
                  to="/bookings"
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  My Bookings
                </Link>
                {isAdmin() && (
                  <Link
                    to="/admin/dashboard"
                    className="text-orange-400 hover:text-orange-300 transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <div className="flex items-center justify-between px-2 py-1 border-t border-white/10 pt-3">
                  <span className="text-white text-sm">{user?.name || user?.email}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    className="text-white hover:text-red-400"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-3">
                <Link
                  to="/login"
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/admin-login"
                  className="text-orange-400 hover:text-orange-300 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Login
                </Link>
                <Link
                  to="/register"
                  className="text-white hover:text-blue-400 transition-colors px-2 py-1"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
