import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Plane, Calendar, MapPin, Users, CreditCard,
  CheckCircle, ExternalLink, Shield, ArrowRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/context/AuthContext';
import { bookingAPI } from '@/services/api';
import PaymentGateway from '@/components/PaymentGateway';

const AirlineBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const {
    outboundBookingId,
    returnBookingId,
    flightData,
    outboundFlight,
    returnFlight,
    passengerCount,
    tripType
  } = location.state || {};

  const [loading, setLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState('pending'); // Default to pending
  const [showPaymentGateway, setShowPaymentGateway] = useState(false);

  // Determine if it's one-way or round-trip
  const isRoundTrip = tripType === 'round-trip' && !!outboundFlight && !!returnFlight;
  const isOneWay = !isRoundTrip && !!flightData;

  // Redirect if no valid data
  useEffect(() => {
    if (!outboundBookingId && !flightData) {
      toast({
        title: "Invalid Booking",
        description: "No booking data found. Redirecting...",
        variant: "destructive"
      });
      navigate('/flights');
    }
  }, [outboundBookingId, flightData, navigate]);

  // Refresh booking status
  const refreshBookingStatus = async () => {
    if (!outboundBookingId) return;
    try {
      const response = await bookingAPI.getById(outboundBookingId);
      const status = response.data?.status?.toLowerCase() || 'pending';
      setBookingStatus(status);
    } catch (error) {
      console.error('Error fetching booking status:', error);
    }
  };

  useEffect(() => {
    refreshBookingStatus();
  }, [outboundBookingId]);

  // Calculate total amount
  const totalAmount = isOneWay
    ? (flightData?.price || 0) * passengerCount
    : ((outboundFlight?.price || 0) + (returnFlight?.price || 0)) * passengerCount;

  // Handle opening payment gateway
  const handleCompleteBooking = () => {
    if (bookingStatus === 'pending') {
      toast({
        title: "Already Confirmed",
        description: "This booking is already confirmed."
      });
      return;
    }
    setShowPaymentGateway(true);
  };

  // Handle payment success
  const handlePaymentSuccess = async () => {
    setLoading(true);
    try {
      let success = true;

      // Update outbound booking status
      try {
        await bookingAPI.updateStatus(outboundBookingId, 'Confirmed');
      } catch (error) {
        console.error('Failed to confirm outbound booking:', error);
        success = false;
      }

      // Update return booking if round-trip
      if (isRoundTrip && returnBookingId) {
        try {
          await bookingAPI.updateStatus(returnBookingId, 'Confirmed');
        } catch (error) {
          console.error('Failed to confirm return booking:', error);
          success = false;
        }
      }

      // Update UI
      setBookingStatus('confirmed');
      setShowPaymentGateway(false);

      toast({
        title: "Booking Confirmed!",
        description: "Your flight has been confirmed successfully!"
      });

      // Redirect after success
      setTimeout(() => navigate('/payments'), 2000);
    } catch (error) {
      console.error('Payment success error:', error);
      toast({
        title: "Payment Successful",
        description: "But booking confirmation failed. Contact support with Booking ID."
      });
      setTimeout(() => navigate('/payments'), 2000);
    } finally {
      setLoading(false);
    }
  };

  // Handle payment failure
  const handlePaymentFailure = () => {
    setShowPaymentGateway(false);
    toast({
      title: "Payment Failed",
      description: "Please try again or use a different payment method.",
      variant: "destructive"
    });
  };

  // Handle external airline booking
  const handleExternalBooking = () => {
    const airlineName = isOneWay ? flightData?.airlineName : outboundFlight?.airlineName;
    toast({
      title: "Redirecting to Airline",
      description: `Opening ${airlineName}'s booking site...`
    });
    window.open(`https://airline.com/booking/${outboundBookingId}`, '_blank');
  };

  if (!outboundBookingId || (!flightData && !outboundFlight)) return null;

  return (
    <>
      <Helmet>
        <title>Complete Booking - Flynest</title>
        <meta name="description" content="Complete your flight booking securely with Flynest or the airline." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-8">
            <Button
              variant="ghost"
              onClick={() => navigate('/flights')}
              className="mb-4 text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Flights
            </Button>
            <h1 className="text-4xl font-bold text-white mb-2">Complete Your Booking</h1>
            <p className="text-gray-300">Review your booking and proceed to payment.</p>
          </motion.div>

          {/* Booking Summary */}
          <Card className="glass-effect border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <span>Booking Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* One-Way */}
              {isOneWay && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
                    <div>
                      <p className="text-sm text-gray-400">Flight</p>
                      <p className="font-medium">{flightData.flightNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Route</p>
                      <p className="font-medium">{flightData.departureAirport} → {flightData.arrivalAirport}</p>
                    </div>
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
                    <div>
                      <p className="text-sm text-gray-400">Passengers</p>
                      <p className="font-medium">{passengerCount}</p>
                    </div>
                  </div>
                  <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Booking ID: {outboundBookingId}
                    </Badge>
                    <p className="font-bold text-white text-xl">₹{totalAmount}</p>
                  </div>
                </div>
              )}

              {/* Round-Trip */}
              {isRoundTrip && (
                <div className="space-y-6">
                  {/* Outbound */}
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Plane className="mr-2 h-4 w-4 text-blue-400" />
                      Outbound Flight
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-white">
                      <div>
                        <p className="text-sm text-gray-400">Flight</p>
                        <p className="font-medium">{outboundFlight.flightNumber}</p>
                      </div>
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
                      <div>
                        <p className="text-sm text-gray-400">Route</p>
                        <p className="font-medium">{outboundFlight.departureAirport} → {outboundFlight.arrivalAirport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="font-medium">₹{outboundFlight.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Return */}
                  <div className="border border-white/10 rounded-lg p-4">
                    <h3 className="text-lg font-semibold text-white flex items-center">
                      <Plane className="mr-2 h-4 w-4 text-green-400" />
                      Return Flight
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-white">
                      <div>
                        <p className="text-sm text-gray-400">Flight</p>
                        <p className="font-medium">{returnFlight.flightNumber}</p>
                      </div>
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
                      <div>
                        <p className="text-sm text-gray-400">Route</p>
                        <p className="font-medium">{returnFlight.departureAirport} → {returnFlight.arrivalAirport}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Price</p>
                        <p className="font-medium">₹{returnFlight.price}</p>
                      </div>
                    </div>
                  </div>

                  {/* Total */}
                  <div className="border-t border-white/10 pt-4">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 self-start">
                        Booking ID: {outboundBookingId}
                      </Badge>
                      <div className="text-right">
                        <p className="text-sm text-gray-400">Total (x{passengerCount})</p>
                        <p className="font-bold text-white text-xl">₹{totalAmount}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Booking Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pay via Flynest */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <Shield className="h-5 w-5 text-green-400" />
                  <span>Pay via Flynest</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Secure payment with instant confirmation and 24/7 support.
                </p>
                <ul className="space-y-2">
                  {["Instant confirmation", "End-to-end encryption", "Refund protection"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm text-gray-300">
                      <CheckCircle className="h-4 w-4 text-green-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleCompleteBooking}
                  disabled={loading || bookingStatus === 'pending'}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </>
                  )
                  //  : bookingStatus === 'confirmed' ? (
                  //   <>
                  //     <CheckCircle className="mr-2 h-4 w-4" />
                  //     Booking Confirmed
                  //   </>
                  // )
                  : (
                    <>
                      <CreditCard className="mr-2 h-4 w-4" />
                      Pay ₹{totalAmount} Now
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Book with Airline */}
            <Card className="glass-effect border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center space-x-2">
                  <ExternalLink className="h-5 w-5 text-blue-400" />
                  <span>Book with Airline</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-300 text-sm">
                  Complete booking directly on the airline's website using saved passenger info.
                </p>
                <ul className="space-y-2">
                  {["Direct airline terms", "Pre-filled passenger info", "Manage via airline"].map((item) => (
                    <li key={item} className="flex items-center space-x-2 text-sm text-gray-400">
                      <ExternalLink className="h-4 w-4 text-blue-400" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={handleExternalBooking}
                  variant="outline"
                  className="w-full border-blue-400/30 text-blue-400 hover:bg-blue-400/10"
                >
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Continue to Airline
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Notice */}
          <Card className="glass-effect border-yellow-500/30 mt-8">
            <CardContent className="p-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="h-5 w-5 text-yellow-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-white mb-1">Passenger Info Saved</h3>
                  <p className="text-gray-300 text-sm">
                    Your details are securely stored. You can complete payment now or later.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Gateway Modal */}
        {showPaymentGateway && (
          <PaymentGateway
            amount={totalAmount}
            bookingId={outboundBookingId}
            onPaymentSuccess={handlePaymentSuccess}
            onPaymentFailure={handlePaymentFailure}
            onClose={() => setShowPaymentGateway(false)}
          />
        )}
      </div>
    </>
  );
};

export default AirlineBooking;