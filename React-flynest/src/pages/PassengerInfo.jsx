import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, User, Plane, Calendar, MapPin, CreditCard } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { bookingAPI, passengerAPI } from '@/services/api';

const PassengerInfo = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const { outboundFlight, returnFlight, tripType, searchParams } = location.state || {};
  const flightData = location.state?.flightData || outboundFlight;

  // Determine trip type
  const isRoundTrip = tripType === 'round-trip' && !!outboundFlight && !!returnFlight;
  const isOneWay = !isRoundTrip && !!flightData;

  // Validate flight data
  if (!isOneWay && !isRoundTrip) {
    toast({
      title: "No Flight Selected",
      description: "Redirecting to flights page.",
      variant: "destructive"
    });
    navigate('/flights');
    return null;
  }

  const [passengers, setPassengers] = useState([
    {
      full_name: '',
      gender: '',
      birthdate: '',
      passport_number: ''
    }
  ]);

  const [loading, setLoading] = useState(false);

  const addPassenger = () => {
    setPassengers([
      ...passengers,
      {
        full_name: '',
        gender: '',
        birthdate: '',
        passport_number: ''
      }
    ]);
  };

  const removePassenger = (index) => {
    if (passengers.length > 1) {
      setPassengers(passengers.filter((_, i) => i !== index));
    }
  };

  const updatePassenger = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const validateForm = () => {
    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (!passenger.full_name || !passenger.full_name.trim()) return false;
      if (!passenger.gender) return false;
      if (!passenger.birthdate || isNaN(new Date(passenger.birthdate).getTime())) return false;
      if (!passenger.passport_number || passenger.passport_number.length !== 12) return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all passenger information fields correctly.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      let outboundBookingId = null;
      let returnBookingId = null;

      // Create booking for one-way
      if (isOneWay) {
        const bookingData = {
          userId: user.userId || user.id,
          flightId: flightData.id,
          flightNumber: flightData.flightNumber,
          departureCity: flightData.departureAirport,
          arrivalCity: flightData.arrivalAirport,
          flightDate: flightData.flightDate,
          amount: flightData.price ?? 0,
          status: 'confirmed', // Will be updated after payment
        };

        const res = await bookingAPI.create(bookingData);
        outboundBookingId = res.data?.bookingId || res.data?.id;
        if (!outboundBookingId) throw new Error("Failed to create booking");

        // Create passengers
        for (const passenger of passengers) {
          const paxData = {
            BookingId: outboundBookingId,
            FullName: passenger.full_name,
            Gender: passenger.gender,
            Birthdate: passenger.birthdate,
            PassportNumber: passenger.passport_number
          };
          await passengerAPI.create(paxData);
        }
      }

      // Create bookings for round-trip
      if (isRoundTrip) {
        // Outbound booking
        const outboundData = {
          userId: user.userId || user.id,
          flightId: outboundFlight.id,
          flightNumber: outboundFlight.flightNumber,
          departureCity: outboundFlight.departureAirport,
          arrivalCity: outboundFlight.arrivalAirport,
          flightDate: outboundFlight.flightDate,
          amount: outboundFlight.price ?? 0,
          status: 'confirmed',
        };

        const outboundRes = await bookingAPI.create(outboundData);
        outboundBookingId = outboundRes.data?.bookingId || outboundRes.data?.id;
        if (!outboundBookingId) throw new Error("Failed to create outbound booking");

        // Return booking
        const returnData = {
          userId: user.userId || user.id,
          flightId: returnFlight.id,
          flightNumber: returnFlight.flightNumber,
          departureCity: returnFlight.departureAirport,
          arrivalCity: returnFlight.arrivalAirport,
          flightDate: returnFlight.flightDate,
          amount: returnFlight.price ?? 0,
          status: 'confirmed',
        };

        const returnRes = await bookingAPI.create(returnData);
        returnBookingId = returnRes.data?.bookingId || returnRes.data?.id;
        if (!returnBookingId) throw new Error("Failed to create return booking");

        // Create passengers for both
        for (const passenger of passengers) {
          await passengerAPI.create({
            BookingId: outboundBookingId,
            FullName: passenger.full_name,
            Gender: passenger.gender,
            Birthdate: passenger.birthdate,
            PassportNumber: passenger.passport_number
          });

          await passengerAPI.create({
            BookingId: returnBookingId,
            FullName: passenger.full_name,
            Gender: passenger.gender,
            Birthdate: passenger.birthdate,
            PassportNumber: passenger.passport_number
          });
        }
      }

      toast({
        title: "Passenger Info Saved",
        description: "Proceed to complete your booking and payment."
      });

      // ✅ Navigate to AirlineBooking with all required data
      navigate('/airline-booking', {
        state: {
          outboundBookingId,
          returnBookingId,
          flightData: isOneWay ? flightData : null,
          outboundFlight: isRoundTrip ? outboundFlight : null,
          returnFlight: isRoundTrip ? returnFlight : null,
          passengerCount: passengers.length,
          tripType
        }
      });

    } catch (error) {
      console.error("Error saving passenger info:", error);
      toast({
        title: "Booking Failed",
        description: error.message || "Could not save passenger information. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Passenger Information - Flynest</title>
        <meta name="description" content="Enter passenger details for your flight booking." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/flights')}
              className="mb-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Flights
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">Passenger Information</h1>
            <p className="text-gray-300">Please provide details for all passengers</p>
          </motion.div>

          {/* Flight Summary */}
          <Card className="glass-effect border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Plane className="h-5 w-5" />
                <span>Flight Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* One-Way */}
              {isOneWay && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-blue-400" />
                      <div>
                        <p className="text-sm text-gray-400">From</p>
                        <p className="font-medium">{flightData.departureAirport}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-green-400" />
                      <div>
                        <p className="text-sm text-gray-400">To</p>
                        <p className="font-medium">{flightData.arrivalAirport}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-purple-400" />
                      <div>
                        <p className="text-sm text-gray-400">Date</p>
                        <p className="font-medium">
                          {new Intl.DateTimeFormat('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          }).format(new Date(flightData.flightDate))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Departure</p>
                        <p className="font-medium">{flightData.departureTime}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <div>
                        <p className="text-sm text-gray-400">Arrival</p>
                        <p className="font-medium">{flightData.arrivalTime}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Flight</p>
                      <p className="font-medium text-white">{flightData.flightNumber}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">Price per Passenger</p>
                      <p className="font-bold text-white text-xl">₹{flightData.price}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Round-Trip */}
              {isRoundTrip && (
                <>
                  <div className="mb-6 pb-6 border-b border-white/10">
                    <h3 className="text-lg font-semibold text-white mb-3">Outbound Flight</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">From</p>
                          <p className="font-medium">{outboundFlight.departureAirport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">To</p>
                          <p className="font-medium">{outboundFlight.arrivalAirport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="font-medium">
                            {new Intl.DateTimeFormat('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }).format(new Date(outboundFlight.flightDate))}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Departure</p>
                          <p className="font-medium">{outboundFlight.departureTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Arrival</p>
                          <p className="font-medium">{outboundFlight.arrivalTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Flight</p>
                        <p className="font-medium text-white">{outboundFlight.flightNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-3">Return Flight</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-white">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-400" />
                        <div>
                          <p className="text-sm text-gray-400">From</p>
                          <p className="font-medium">{returnFlight.departureAirport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-green-400" />
                        <div>
                          <p className="text-sm text-gray-400">To</p>
                          <p className="font-medium">{returnFlight.arrivalAirport}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-purple-400" />
                        <div>
                          <p className="text-sm text-gray-400">Date</p>
                          <p className="font-medium">
                            {new Intl.DateTimeFormat('en-IN', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            }).format(new Date(returnFlight.flightDate))}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Departure</p>
                          <p className="font-medium">{returnFlight.departureTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <div>
                          <p className="text-sm text-gray-400">Arrival</p>
                          <p className="font-medium">{returnFlight.arrivalTime}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Flight</p>
                        <p className="font-medium text-white">{returnFlight.flightNumber}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-gray-400">Total Price (per passenger)</p>
                      <p className="font-bold text-white text-xl">
                        ₹{outboundFlight.price + returnFlight.price}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Passenger Form */}
          <Card className="glass-effect border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Passenger Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {passengers.map((passenger, index) => (
                  <div key={index} className="border border-white/10 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">Passenger {index + 1}</h3>
                      {passengers.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removePassenger(index)}
                          className="text-red-400 border-red-400/30 hover:bg-red-400/10"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor={`full_name_${index}`} className="text-white">Full Name</Label>
                        <Input
                          id={`full_name_${index}`}
                          value={passenger.full_name}
                          onChange={(e) => updatePassenger(index, 'full_name', e.target.value)}
                          placeholder="Enter full name"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`gender_${index}`} className="text-white">Gender</Label>
                        <Select value={passenger.gender} onValueChange={(value) => updatePassenger(index, 'gender', value)} required>
                          <SelectTrigger className="bg-white/5 border-white/10 text-white">
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor={`birthdate_${index}`} className="text-white">Birthdate</Label>
                        <Input
                          id={`birthdate_${index}`}
                          type="date"
                          value={passenger.birthdate}
                          onChange={(e) => updatePassenger(index, 'birthdate', e.target.value)}
                          className="bg-white/5 border-white/10 text-white"
                          max={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor={`aadhar_${index}`} className="text-white">Aadhar Number</Label>
                        <Input
                          id={`aadhar_${index}`}
                          type="text"
                          value={passenger.passport_number}
                          onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, '');
                            if (value.length <= 12) {
                              updatePassenger(index, 'passport_number', value);
                            }
                          }}
                          placeholder="Enter 12-digit Aadhar number"
                          className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                          maxLength={12}
                          minLength={12}
                          required
                        />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addPassenger}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    + Add Another Passenger
                  </Button>
                </div>
                <div className="pt-6 border-t border-white/10">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Continue to Payment
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PassengerInfo;