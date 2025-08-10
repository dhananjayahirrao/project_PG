import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Plane, 
  Search, 
  Edit, 
  Trash2, 
  Plus,
  Eye,
  ArrowLeft,
  Filter,
  Calendar,
  Clock,
  MapPin,
  DollarSign
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { adminAPI } from '@/services/api';

const AdminFlights = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [filteredFlights, setFilteredFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [showFlightModal, setShowFlightModal] = useState(false);
  const [showAddFlightModal, setShowAddFlightModal] = useState(false);
  const [newFlight, setNewFlight] = useState({
     flight_number: '',
     flight_date: '',
     flight_status: '',
     departure_airport: '',
     departure_timezone: '',
     departure_iata: '',
     departure_icao: '',
     departure_terminal: '',
     departure_gate: '',
     departure_delay: '',
     arrival_airport: '',
     arrival_timezone: '',
     arrival_iata: '',
     arrival_icao: '',
     arrival_terminal: '',
     arrival_gate: '',
     arrival_baggage: '',
     arrival_delay: '',
     airline_name: '',
     airline_iata: '',
     airline_icao: '',
     aircraft_id: '',
     price: '',
     availableSeats: ''
  });

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('flynest_admin_token');
    if (!adminToken) {
      toast({
        title: "Access Denied",
        description: "Please log in as admin to access this page.",
        variant: "destructive"
      });
      navigate('/admin-login');
      return;
    }

    loadFlights();
  }, [navigate]);

  useEffect(() => {
    // Filter flights based on search term
    const filtered = flights.filter(flight =>
      flight.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.departureCity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.arrivalCity?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredFlights(filtered);
  }, [flights, searchTerm]);

  const loadFlights = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getAllFlights();
      setFlights(response.data);
    } catch (error) {
      console.error('Error loading flights:', error);
      toast({
        title: "Error",
        description: "Failed to load flights.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFlight = async (flightId) => {
    if (!window.confirm('Are you sure you want to delete this flight?')) {
      return;
    }

    try {
      await adminAPI.deleteFlight(flightId);
      toast({
        title: "Success",
        description: "Flight deleted successfully."
      });
      loadFlights(); // Reload flights
    } catch (error) {
      console.error('Error deleting flight:', error);
      toast({
        title: "Error",
        description: "Failed to delete flight.",
        variant: "destructive"
      });
    }
  };

  const handleUpdateFlight = async (flightId, flightData) => {
    try {
      await adminAPI.updateFlight(flightId, flightData);
      toast({
        title: "Success",
        description: "Flight updated successfully."
      });
      setShowFlightModal(false);
      setSelectedFlight(null);
      loadFlights(); // Reload flights
    } catch (error) {
      console.error('Error updating flight:', error);
      toast({
        title: "Error",
        description: "Failed to update flight.",
        variant: "destructive"
      });
    }
  };

  const handleAddFlight = async () => {
    try {
      await adminAPI.createFlight(newFlight);
      toast({
        title: "Success",
        description: "Flight added successfully."
      });
      setShowAddFlightModal(false);
      setNewFlight({
         flight_number: '',
         flight_date: '',
         flight_status: '',
         departure_airport: '',
         departure_timezone: '',
         departure_iata: '',
         departure_icao: '',
         departure_terminal: '',
         departure_gate: '',
         departure_delay: '',
         arrival_airport: '',
         arrival_timezone: '',
         arrival_iata: '',
         arrival_icao: '',
         arrival_terminal: '',
         arrival_gate: '',
         arrival_baggage: '',
         arrival_delay: '',
         airline_name: '',
         airline_iata: '',
         airline_icao: '',
         aircraft_id: '',
         price: '',
         availableSeats: ''
      });
      loadFlights(); // Reload flights
    } catch (error) {
      console.error('Error adding flight:', error);
      toast({
        title: "Error",
        description: "Failed to add flight.",
        variant: "destructive"
      });
    }
  };

  const openFlightModal = (flight) => {
    setSelectedFlight(flight);
    setShowFlightModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading flights...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Manage Flights - Admin Dashboard</title>
        <meta name="description" content="Manage flights in Flynest admin dashboard." />
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
              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  onClick={() => navigate('/admin/dashboard')}
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Dashboard
                </Button>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Manage Flights
                  </h1>
                  <p className="text-gray-300">
                    View and manage all flight schedules ({flights.length} total)
                  </p>
                </div>
              </div>
              <Button onClick={() => setShowAddFlightModal(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="mr-2 h-4 w-4" />
                Add Flight
              </Button>
            </div>
          </motion.div>

          {/* Search and Filters */}
          <Card className="glass-effect border-white/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search flights by number, departure, or arrival..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Flights List */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Plane className="h-5 w-5" />
                <span>All Flights ({filteredFlights.length})</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {filteredFlights.length > 0 ? (
                <div className="space-y-4">
                  {filteredFlights.map((flight) => (
                    <motion.div
                      key={flight.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center justify-between p-4 border border-white/10 rounded-lg hover:bg-white/5 transition-all"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-white">{flight.flightNumber}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span className="flex items-center">
                              <MapPin className="h-3 w-3 mr-1" />
                              {flight.departureAirport} -> {flight.arrivalAirport}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                                {flight.flightDate
                                  ? new Date(flight.flightDate).toLocaleDateString('en-GB', {
                                      day: '2-digit',
                                      month: 'short',
                                      year: 'numeric',
                                    })
                                  : 'No Date'}
                            </span>

                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                                {flight.departureTime}
                              </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {/* <Badge 
                          className={
                            flight.availableSeats > 0
                              ? 'bg-green-500/20 text-green-400 border-green-500/30'
                              : 'bg-red-500/20 text-red-400 border-red-500/30'
                          }
                        >
                          {flight.availableSeats} seats
                        </Badge> */}
                        
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-medium">
                            ₹{flight.price}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFlightModal(flight)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openFlightModal(flight)}
                            className="text-gray-400 hover:text-white"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteFlight(flight.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Plane className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    {searchTerm ? 'No flights found matching your search.' : 'No flights found.'}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Flight Modal */}
      {showFlightModal && selectedFlight && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
              className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Flight Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Flight ID</label>
                <Input
                  value={selectedFlight.flightNumber || ''}
                  onChange={(e) => setSelectedFlight({...selectedFlight, flightNumber: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              {/* Flight Date */}
              <div>
                <label className="text-sm text-gray-400">Flight Date</label>
                <Input
                  type="date"
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow's date
                  value={newFlight.flightDate || ''}
                  onChange={(e) => setNewFlight({ ...newFlight, flightDate: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>


              {/* Flight Status */}
              <div>
                <label className="text-sm text-gray-400">Flight Status</label>
                <Input
                  value={selectedFlight.flightStatus || ''}
                  onChange={(e) => setSelectedFlight({ ...selectedFlight, flightStatus: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              {/*  Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Airport</label>
                  <Input
                    value={selectedFlight.departureAirport || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureAirport: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Airport</label>
                  <Input
                    value={selectedFlight.arrivalAirport || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalAirport: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Time</label>
                  <Input
                    type="time"
                    value={selectedFlight.departureTime || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureTime: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Time</label>
                  <Input
                    type="time"
                    value={selectedFlight.arrivalTime || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalTime: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>


              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure IATA</label>
                  <Input
                    value={selectedFlight.departureIata || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival IATA</label>
                  <Input
                    value={selectedFlight.arrivalIata || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure ICAO</label>
                  <Input
                    value={selectedFlight.departureIcao || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival ICAO</label>
                  <Input
                    value={selectedFlight.arrivalIcao || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Terminal</label>
                  <Input
                    value={selectedFlight.departureTerminal || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureTerminal: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Terminal</label>
                  <Input
                    value={selectedFlight.arrivalTerminal || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalTerminal: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Gate</label>
                  <Input
                    value={selectedFlight.departureGate || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureGate: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Gate</label>
                  <Input
                    value={selectedFlight.arrivalGate || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalGate: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Arrival Baggage</label>
                <Input
                  value={selectedFlight.arrivalBaggage || ''}
                  onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalBaggage: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              {/* Delays */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Delay (min)</label>
                  <Input
                    type="number"
                    value={selectedFlight.departureDelay || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, departureDelay: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Delay (min)</label>
                  <Input
                    type="number"
                    value={selectedFlight.arrivalDelay || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, arrivalDelay: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Airline Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Airline Name</label>
                  <Input
                    value={selectedFlight.airlineName || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, airlineName: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Airline IATA</label>
                  <Input
                    value={selectedFlight.airlineIata || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, airlineIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Airline ICAO</label>
                  <Input
                    value={selectedFlight.airlineIcao || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, airlineIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Flight Number</label>
                  <Input
                    value={selectedFlight.flightNumber || ''}
                    onChange={(e) => setSelectedFlight({ ...selectedFlight, flightNumber: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Aircraft */}
              <div>
                <label className="text-sm text-gray-400">Aircraft ID</label>
                <Input
                  value={selectedFlight.aircraftId || ''}
                  onChange={(e) => setSelectedFlight({ ...selectedFlight, aircraftId: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={() => handleUpdateFlight(selectedFlight.id, selectedFlight)}
                className="flex-1"
              >
                Update Flight
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowFlightModal(false);
                  setSelectedFlight(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add Flight Modal */}
      {showAddFlightModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
          >
            <h3 className="text-xl font-bold text-white mb-4">Add New Flight</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Flight id</label>
                <Input
                  value={newFlight.flightNumber}
                  onChange={(e) => setNewFlight({...newFlight, flightNumber: e.target.value})}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
              {/* Flight Date */}
             <div>
                <label className="text-sm text-gray-400">Flight Date</label>
                <Input
                  type="date"
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]} // Tomorrow's date
                  value={newFlight.flightDate || ''}
                  onChange={(e) => setNewFlight({ ...newFlight, flightDate: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>


              {/* Flight Status */}
              <div>
                <label className="text-sm text-gray-400">Flight Status</label>
                <Input
                  value={newFlight.flightStatus || ''}
                  onChange={(e) => setNewFlight({ ...newFlight, flightStatus: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              {/* Airport Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Airport</label>
                  <Input
                    value={newFlight.departureAirport || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureAirport: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Airport</label>
                  <Input
                    value={newFlight.arrivalAirport || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalAirport: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

             <div className="grid grid-cols-2 gap-4">
  <div>
    <label className="text-sm text-gray-400">Departure Time</label>
    <Input
      type="time"
      value={newFlight.departureTime || ''}
      onChange={(e) => setNewFlight({ ...newFlight, departureTime: e.target.value })}
      className="bg-white/5 border-white/20 text-white"
    />
  </div>
  <div>
    <label className="text-sm text-gray-400">Arrival Time</label>
    <Input
      type="time"
      value={newFlight.arrivalTime || ''}
      onChange={(e) => setNewFlight({ ...newFlight, arrivalTime: e.target.value })}
      className="bg-white/5 border-white/20 text-white"
    />
  </div>
</div>


              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure IATA</label>
                  <Input
                    value={newFlight.departureIata || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival IATA</label>
                  <Input
                    value={newFlight.arrivalIata || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure ICAO</label>
                  <Input
                    value={newFlight.departureIcao || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival ICAO</label>
                  <Input
                    value={newFlight.arrivalIcao || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Terminal</label>
                  <Input
                    value={newFlight.departureTerminal || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureTerminal: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Terminal</label>
                  <Input
                    value={newFlight.arrivalTerminal || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalTerminal: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Gate</label>
                  <Input
                    value={newFlight.departureGate || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureGate: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Gate</label>
                  <Input
                    value={newFlight.arrivalGate || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalGate: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-gray-400">Arrival Baggage</label>
                <Input
                  value={newFlight.arrivalBaggage || ''}
                  onChange={(e) => setNewFlight({ ...newFlight, arrivalBaggage: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>

              {/* Delays */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Departure Delay (min)</label>
                  <Input
                    type="number"
                    value={newFlight.departureDelay || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, departureDelay: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Arrival Delay (min)</label>
                  <Input
                    type="number"
                    value={newFlight.arrivalDelay || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, arrivalDelay: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              {/* Airline Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Airline Name</label>
                  <Input
                    value={newFlight.airlineName || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, airlineName: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400">Airline IATA</label>
                  <Input
                    value={newFlight.airlineIata || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, airlineIata: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400">Airline ICAO</label>
                  <Input
                    value={newFlight.airlineIcao || ''}
                    onChange={(e) => setNewFlight({ ...newFlight, airlineIcao: e.target.value })}
                    className="bg-white/5 border-white/20 text-white"
                  />
                </div>
               <div>
  <label className="text-sm text-gray-400">Price (Rs.)</label>
  <Input
    type="number"
    min="0"
    step="0.01"
    value={newFlight.price || ''}
    onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })}
    className="bg-white/5 border-white/20 text-white"
  />
</div>

              </div>

              {/* Aircraft ID */}
              <div>
                <label className="text-sm text-gray-400">Aircraft ID</label>
                <Input
                  value={newFlight.aircraftId || ''}
                  onChange={(e) => setNewFlight({ ...newFlight, aircraftId: e.target.value })}
                  className="bg-white/5 border-white/20 text-white"
                />
              </div>
            </div>
           
            <div className="flex space-x-2 mt-6">
              <Button
                onClick={handleAddFlight}
                className="flex-1"
              >
                Add Flight
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowAddFlightModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default AdminFlights;