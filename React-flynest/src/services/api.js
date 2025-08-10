import axios from 'axios';

// ✅ Replace with your actual deployed backend API URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:44327/api'; // Back to HTTPS

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Debug logging
console.log('API Base URL:', API_BASE_URL);

// ✅ Add token to all outgoing requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('flynest_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('API Request:', config.method?.toUpperCase(), config.url, config.data);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Global error handling for 401 Unauthorized
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.config?.url, error.response?.data);
    if (error.response?.status === 401) {
      localStorage.removeItem('flynest_token');
      localStorage.removeItem('flynest_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

//
// 🔐 AUTH APIs
//
export const authAPI = {
  login: (credentials) => api.post('/Auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  refreshToken: () => api.post('/Auth/refresh'),
};

//
// ✈️ FLIGHT APIs
//
export const flightAPI = {
  getAll: (params) => api.get('/flights', { params }),
  getById: (id) => api.get(`/flights/${id}`),
  search: (searchParams) => api.get('/flights/search', { params: searchParams }),
  create: (data) => api.post('/flights', data),
  update: (id, data) => api.put(`/flights/${id}`, data),
  delete: (id) => api.delete(`/flights/${id}`),
};

//
// 🧳 BOOKING APIs
//
export const bookingAPI = {
  create: (data) => api.post('/Bookings', data),
  getByUser: (userId) => api.get(`/Bookings/user/${userId}`),
  getById: (id) => api.get(`/Bookings/${id}`),
  // Delete booking from database
  delete: (id) => api.delete(`/Bookings/${id}`),
  // Cancel booking (update status to cancelled)
  cancel: (id) => api.put(`/Bookings/${id}`, { status: 'cancelled' }),
  getAll: () => api.get('/Bookings'),
  updateStatus: (id, status) => {
    // Try different status formats to ensure compatibility
    const statusData = { status };
    console.log(`Updating booking ${id} status to:`, status);
    return api.put(`/Bookings/${id}`, statusData);
  },
  // Alternative method for status updates with different casing
  updateStatusAlternative: (id, status) => {
    const statusData = { Status: status }; // PascalCase for C# backend
    console.log(`Updating booking ${id} status to (PascalCase):`, status);
    return api.put(`/Bookings/${id}`, statusData);
  },
  // Check and update booking status based on payment
  checkAndUpdateStatus: async (bookingId) => {
    try {
      // Check if booking has successful payment
      const paymentResponse = await paymentAPI.getByBooking(bookingId);
      const hasSuccessfulPayment = paymentResponse.data?.some(payment => 
        payment.paymentStatus?.toLowerCase() === 'succeeded' || 
        payment.PaymentStatus?.toLowerCase() === 'succeeded'
      );
      
      if (hasSuccessfulPayment) {
        // Update booking status to confirmed
        await bookingAPI.updateStatus(bookingId, 'Confirmed');
        console.log(`Booking ${bookingId} status updated to Confirmed due to successful payment`);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error checking and updating booking status:', error);
      return false;
    }
  },
  // Test function to verify API endpoints
  testEndpoints: async (bookingId) => {
    console.log('Testing booking API endpoints...');
    try {
      // Test get booking
      const booking = await bookingAPI.getById(bookingId);
      console.log('Get booking successful:', booking.data);
      
      // Test update status
      const updateResult = await bookingAPI.updateStatus(bookingId, 'Confirmed');
      console.log('Update status successful:', updateResult.data);
      
      return true;
    } catch (error) {
      console.error('API test failed:', error);
      return false;
    }
  }
};

//
// 💳 PAYMENT APIs
//
export const paymentAPI = {
  create: (data) => api.post('/Payments', data),
  getById: (id) => api.get(`/Payments/${id}`),
  getAll: () => api.get('/Payments'),
  update: (id, data) => api.put(`/Payments/${id}`, data),
  delete: (id) => api.delete(`/Payments/${id}`),
  getByBooking: (bookingId) => api.get(`/Payments/booking/${bookingId}`),
  // Add endpoint to get payments by user (if your backend supports it)
  getByUser: (userId) => api.get(`/Payments/user/${userId}`),
  // Fallback endpoints in case the user-specific endpoint doesn't exist
  getByUserFallback: (userId) => api.get(`/Payments?userId=${userId}`),
  getByUserAlternative: (userId) => api.get(`/Payments/by-user/${userId}`),
};

//
// 👤 USER APIs
//
export const userAPI = {
  getProfile: () => api.get('/users/profile'),      // updated from `/users`
  updateProfile: (data) => api.put(`/users/${id}`, data), // better endpoint naming
  getAll: () => api.get('/users'),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

//
// 👥 PASSENGER APIs
//
export const passengerAPI = {
  create: (data) => api.post('/Passengers', data),
  getByBooking: (bookingId) => api.get(`/Passengers/booking/${bookingId}`),
  update: (id, data) => api.put(`/Passengers/${id}`, data),
  delete: (id) => api.delete(`/Passengers/${id}`),
};

//
// 🔐 ADMIN APIs
//
export const adminAPI = {
  login: (credentials) => api.post('/Auth/admin-login', credentials),
  // USERS
  getAllUsers: () => api.get('/Users'),
  getUserById: (id) => api.get(`/Users/${id}`),
  updateUser: (id, data) => api.put(`/Users/${id}`, data),
  deleteUser: (id) => api.delete(`/Users/${id}`),
  createUser: (data) => api.post('/Users', data),
  // Alternative user endpoints
  getAllUsersAlt: () => api.get('/users'),
  updateUserAlt: (id, data) => api.put(`/users/${id}`, data),
  deleteUserAlt: (id) => api.delete(`/users/${id}`),
  // FLIGHTS
  getAllFlights: () => api.get('/Flights'),
  getFlightById: (id) => api.get(`/Flights/${id}`),
  updateFlight: (id, data) => api.put(`/Flights/${id}`, data),
  deleteFlight: (id) => api.delete(`/Flights/${id}`),
  createFlight: (data) => api.post('/Flights', data),
  // BOOKINGS
  getAllBookings: () => api.get('/Bookings'),
  getBookingById: (id) => api.get(`/Bookings/${id}`),
  updateBooking: (id, data) => api.put(`/Bookings/${id}`, data),
  deleteBooking: (id) => api.delete(`/Bookings/${id}`),
  createBooking: (data) => api.post('/Bookings', data),
  // Alternative booking endpoints
  getAllBookingsAlt: () => api.get('/bookings'),
  updateBookingAlt: (id, data) => api.put(`/bookings/${id}`, data),
  deleteBookingAlt: (id) => api.delete(`/bookings/${id}`),
  // Test functions for debugging
  testUserEndpoints: async (userId) => {
    console.log('Testing admin user API endpoints...');
    try {
      // Test get user
      const user = await adminAPI.getUserById(userId);
      console.log('Get user successful:', user.data);
      
      // Test update user
      const updateData = { name: 'Test Update' };
      const updateResult = await adminAPI.updateUser(userId, updateData);
      console.log('Update user successful:', updateResult.data);
      
      return true;
    } catch (error) {
      console.error('Admin user API test failed:', error);
      return false;
    }
  },
  testBookingEndpoints: async (bookingId) => {
    console.log('Testing admin booking API endpoints...');
    try {
      // Test get booking
      const booking = await adminAPI.getBookingById(bookingId);
      console.log('Get booking successful:', booking.data);
      
      // Test update booking
      const updateData = { status: 'Confirmed' };
      const updateResult = await adminAPI.updateBooking(bookingId, updateData);
      console.log('Update booking successful:', updateResult.data);
      
      return true;
    } catch (error) {
      console.error('Admin booking API test failed:', error);
      return false;
    }
  }
};

export default api;
