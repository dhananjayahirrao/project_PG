
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Navbar from '@/components/Layout/Navbar';
import Footer from '@/components/Layout/Footer';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Dashboard from '@/pages/Dashboard';
import Flights from '@/pages/Flights';
import PassengerInfo from '@/pages/PassengerInfo';
import AirlineBooking from '@/pages/AirlineBooking';
import AdminLogin from '@/pages/AdminLogin';
import AdminDashboard from '@/pages/AdminDashboard';
import About from '@/pages/About';
import Support from '@/pages/Support';
import TravelGuide from '@/pages/TravelGuide';
import AdminUsers from '@/pages/AdminUsers';
import AdminFlights from '@/pages/AdminFlights';
import AdminBookings from '@/pages/AdminBookings';
import Bookings from '@/pages/Bookings';
import PaymentHistory from '@/pages/PaymentHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/flights" element={<Flights />} />
              <Route path="/passenger-info" element={<PassengerInfo />} />
              <Route path="/airline-booking" element={<AirlineBooking />} />
              <Route path="/bookings" element={<Bookings />} />
              <Route path="/payments" element={<PaymentHistory />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/flights" element={<AdminFlights />} />
              <Route path="/admin/bookings" element={<AdminBookings />} />
              <Route path="/about" element={<About />} />
              <Route path="/support" element={<Support />} />
              <Route path="/travel-guide" element={<TravelGuide />} />
            </Routes>
          </main>
          <Footer />
          <Toaster />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
