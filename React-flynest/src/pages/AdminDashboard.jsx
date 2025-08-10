// src/pages/AdminDashboard.jsx

import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plane, 
  CreditCard, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { adminAPI } from '@/services/api';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminUser, setAdminUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalFlights: 0,
    totalBookings: 0,
    totalRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('flynest_admin_token');
    const adminUserData = localStorage.getItem('flynest_admin_user');
    
    if (!adminToken || !adminUserData) {
      toast({
        title: "Access Denied",
        description: "Please log in as admin to access this page.",
        variant: "destructive"
      });
      navigate('/admin-login');
      return;
    }

    setAdminUser(JSON.parse(adminUserData));
    loadDashboardData();
  }, [navigate]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [usersRes, flightsRes, bookingsRes] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllFlights(),
        adminAPI.getAllBookings(),
      ]);
      const users = usersRes.data;
      const flights = flightsRes.data;
      const bookings = bookingsRes.data;
      // Calculate statistics
      const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
      setStats({
        totalUsers: users.length,
        totalFlights: flights.length,
        totalBookings: bookings.length,
        totalRevenue: confirmedBookings.reduce((sum, b) => sum + (b.amount || 0), 0),
      });
      // Recent bookings (last 2 days)
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      setRecentBookings(
        bookings
          .filter(b => new Date(b.bookingDate) >= twoDaysAgo)
          .sort((a, b) => new Date(b.bookingDate) - new Date(a.bookingDate))
          .slice(0, 10)
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('flynest_admin_token');
    localStorage.removeItem('flynest_admin_user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out."
    });
    navigate('/admin-login');
  };

  const handleManageUsers = () => {
    navigate('/admin/users');
  };

  const handleManageFlights = () => {
    navigate('/admin/flights');
  };

  const handleManageBookings = () => {
    navigate('/admin/bookings');
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Flynest</title>
        <meta name="description" content="Admin dashboard for managing Flynest flight booking system." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-300">
                  Welcome back, {adminUser?.name || 'Admin'}! Here's your system overview.
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass-effect border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Users
                </CardTitle>
                <Users className="h-4 w-4 text-blue-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
                <p className="text-xs text-gray-400">Registered users</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Flights
                </CardTitle>
                <Plane className="h-4 w-4 text-green-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalFlights}</div>
                <p className="text-xs text-gray-400">Available flights</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Bookings
                </CardTitle>
                <CreditCard className="h-4 w-4 text-purple-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stats.totalBookings}</div>
                <p className="text-xs text-gray-400">Confirmed bookings</p>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  Total Revenue
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-yellow-400" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">₹{stats.totalRevenue?.toLocaleString() || 0}</div>
                <p className="text-xs text-gray-400">Total earnings</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="glass-effect border-white/10 hover:border-blue-500/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Users className="h-5 w-5 text-blue-400" />
                  <span>Manage Users</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  View, edit, and manage user accounts and permissions.
                </p>
                <Button onClick={handleManageUsers} className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  View Users
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 hover:border-green-500/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Plane className="h-5 w-5 text-green-400" />
                  <span>Manage Flights</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  Add, edit, and manage flight schedules and routes.
                </p>
                <Button onClick={handleManageFlights} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Manage Flights
                </Button>
              </CardContent>
            </Card>

            <Card className="glass-effect border-white/10 hover:border-purple-500/30 transition-all duration-300">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-purple-400" />
                  <span>Manage Bookings</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 text-sm mb-4">
                  View and manage all flight bookings and reservations.
                </p>
                <Button onClick={handleManageBookings} className="w-full">
                  <Settings className="mr-2 h-4 w-4" />
                  View Bookings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Recent Bookings</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="flex items-center justify-between p-4 border border-white/10 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium text-white">{booking.flightNumber} </p>
                            <p className="text-sm text-gray-400">
                              {booking.departureCity} → {booking.arrivalCity}
                            </p>
                            <div>
                            <p className="text-sm text-gray-300">
                              {new Date(booking.bookingDate).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-400">₹{booking.amount}</p>
                          </div>
                            <div className="flex items-center gap-2">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="h-4 w-4 text-gray-400"
                                  >
                                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                  </svg>
                                  <label className="text-sm text-gray-400">{booking.user?.name}</label>
                                </div>

                          </div>
                          
                          
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {/* <Badge 
                          className={
                            booking.status === 'Confirmed' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : booking.status === 'Pending'
                              ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }
                        >
                          {booking.status}
                        </Badge> */}
                        {/* <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          <Eye className="h-4 w-4" />
                        </Button> */}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400">No recent bookings found.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
