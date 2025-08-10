import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Search, Filter, Plane, Calendar, MapPin, Users, Star, SortAsc, SortDesc } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { flightAPI } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Flights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [flights, setFlights] = useState([]);
  const [sortedFlights, setSortedFlights] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: '',
    passengers: '1',
    class: 'economy',
    tripType: 'one-way'
  });

  const [sortOption, setSortOption] = useState('price-asc');
  const [selectedOutbound, setSelectedOutbound] = useState(null);
  const [selectedReturn, setSelectedReturn] = useState(null);

  useEffect(() => {
    loadFlights();
  }, []);

  const loadFlights = async () => {
    setLoading(true);
    try {
      const response = await flightAPI.getAll();
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const futureFlights = response.data
        .filter(flight => new Date(flight.flightDate) >= today)
        .sort((a, b) => new Date(a.flightDate) - new Date(b.flightDate));
      const flightsWithLeg = futureFlights.map(f => ({ ...f, tripLeg: 'outbound' }));
      setFlights(flightsWithLeg);
      setSortedFlights(flightsWithLeg);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load flights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!searchParams.from || !searchParams.to || !searchParams.departureDate) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (searchParams.tripType === 'round-trip' && !searchParams.returnDate) {
      toast({
        title: "Return Date Required",
        description: "Please select a return date for round-trip.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      let outboundFlights = [];
      let returnFlights = [];

      const outboundResponse = await flightAPI.search({
        departureAirport: searchParams.from,
        arrivalAirport: searchParams.to,
        flightDate: searchParams.departureDate
      });
      outboundFlights = outboundResponse.data || [];

      if (searchParams.tripType === 'round-trip') {
        const returnResponse = await flightAPI.search({
          departureAirport: searchParams.to,
          arrivalAirport: searchParams.from,
          flightDate: searchParams.returnDate
        });
        returnFlights = returnResponse.data || [];
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const filteredOutbound = outboundFlights
        .filter(flight => new Date(flight.flightDate) >= today)
        .map(f => ({ ...f, tripLeg: 'outbound' }));

      const filteredReturn = returnFlights
        .filter(flight => new Date(flight.flightDate) >= today)
        .map(f => ({ ...f, tripLeg: 'return' }));

      const combinedFlights = [
        ...filteredOutbound,
        ...(searchParams.tripType === 'round-trip' ? filteredReturn : [])
      ];

      setFlights(combinedFlights);
      applySorting(combinedFlights, sortOption);

      toast({
        title: "Search Complete",
        description: searchParams.tripType === 'round-trip'
          ? `Found ${filteredOutbound.length} outbound and ${filteredReturn.length} return flights.`
          : `Found ${filteredOutbound.length} flights.`
      });
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Unable to search flights. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const applySorting = (flightList, option) => {
    const flightsToSort = [...flightList];

    switch (option) {
      case 'price-asc':
        flightsToSort.sort((a, b) => (a.price || Infinity) - (b.price || Infinity));
        break;
      case 'price-desc':
        flightsToSort.sort((a, b) => (b.price || Infinity) - (a.price || Infinity));
        break;
      case 'departure-asc':
        flightsToSort.sort((a, b) => {
          const timeA = a.departureTime ? new Date(`1970-01-01T${a.departureTime}`).getTime() : Infinity;
          const timeB = b.departureTime ? new Date(`1970-01-01T${b.departureTime}`).getTime() : Infinity;
          return timeA - timeB;
        });
        break;
      case 'duration-asc':
        flightsToSort.sort((a, b) => {
          const durationA = a.durationMinutes || 0;
          const durationB = b.durationMinutes || 0;
          return durationA - durationB;
        });
        break;
      default:
        break;
    }

    setSortedFlights(flightsToSort);
  };

  useEffect(() => {
    if (flights.length > 0) {
      applySorting(flights, sortOption);
    }
  }, [sortOption, flights]);

  const handleBookFlight = (flight) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to book a flight.",
        variant: "destructive"
      });
      return;
    }

    if (searchParams.tripType === 'one-way') {
      navigate('/passenger-info', {
        state: {
          flightData: flight,
          tripType: 'one-way',
          searchParams: { ...searchParams }
        }
      });
    } else {
      if (flight.tripLeg === 'outbound') {
        setSelectedOutbound(flight);
        setSelectedReturn(null);
        toast({
          title: "Outbound Selected",
          description: `Outbound flight ${flight.flightNumber} selected. Now pick a return flight.`,
          duration: 3000
        });
      } else if (flight.tripLeg === 'return') {
        if (!selectedOutbound) {
          toast({
            title: "Select Outbound First",
            description: "Please select an outbound flight before choosing a return.",
            variant: "warning"
          });
          return;
        }
        setSelectedReturn(flight);

        navigate('/passenger-info', {
          state: {
            outboundFlight: selectedOutbound,
            returnFlight: flight,
            tripType: 'round-trip',
            searchParams: { ...searchParams }
          }
        });
      }
    }
  };

  const getClassColor = (flightClass) => {
    switch (flightClass?.toLowerCase()) {
      case 'first':
        return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'business':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'economy':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return 'N/A';
    try {
      return new Date(`1970-01-01T${timeStr}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid Time';
    }
  };

  return (
    <>
      <Helmet>
        <title>Search Flights - Flynest</title>
        <meta name="description" content="Find and book one-way or round-trip flights with real-time data and price sorting." />
      </Helmet>

      <div className="min-h-screen pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Find Your <span className="gradient-text">Perfect Flight</span>
            </h1>
            <p className="text-xl text-gray-300">Search and sort flights by price, time, and more</p>
          </motion.div>

          {/* Search Form */}
          <Card className="glass-effect border-white/10 mb-8">
            <CardHeader>
              <CardTitle className="text-white flex items-center space-x-2">
                <Search className="h-5 w-5" />
                <span>Search Flights</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div>
                    <Label htmlFor="from" className="text-white">From</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="from"
                        placeholder="Departure Airport"
                        value={searchParams.from}
                        onChange={(e) => setSearchParams({ ...searchParams, from: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="to" className="text-white">To</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="to"
                        placeholder="Arrival Airport"
                        value={searchParams.to}
                        onChange={(e) => setSearchParams({ ...searchParams, to: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="departureDate" className="text-white">Departure Date</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="departureDate"
                        type="date"
                        min={new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        value={searchParams.departureDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                        onChange={(e) => setSearchParams({ ...searchParams, departureDate: e.target.value })}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                      />
                    </div>
                  </div>

                  {searchParams.tripType === 'round-trip' && (
                    <div>
                      <Label htmlFor="returnDate" className="text-white">Return Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="returnDate"
                          type="date"
                          min={searchParams.departureDate || new Date(Date.now() + 86400000).toISOString().split('T')[0]}
                          value={searchParams.returnDate}
                          onChange={(e) => setSearchParams({ ...searchParams, returnDate: e.target.value })}
                          className="pl-10 bg-white/5 border-white/10 text-white"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-white">Trip Type</Label>
                    <div className="flex border border-white/10 rounded-lg overflow-hidden bg-white/5">
                      <button
                        type="button"
                        className={`flex-1 py-2 text-center text-sm transition-all ${
                          searchParams.tripType === 'one-way'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                        onClick={() =>
                          setSearchParams({ ...searchParams, tripType: 'one-way', returnDate: '' })
                        }
                      >
                        One-Way
                      </button>
                      <button
                        type="button"
                        className={`flex-1 py-2 text-center text-sm transition-all ${
                          searchParams.tripType === 'round-trip'
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-300 hover:bg-white/10'
                        }`}
                        onClick={() =>
                          setSearchParams({ ...searchParams, tripType: 'round-trip' })
                        }
                      >
                        Round-Trip
                      </button>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="class" className="text-white">Class</Label>
                    <Select value={searchParams.class} onValueChange={(value) => setSearchParams({ ...searchParams, class: value })}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="economy">Economy</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="first">First Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  <Search className="mr-2 h-4 w-4" />
                  {loading ? 'Searching...' : 'Search Flights'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Flight Results */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h2 className="text-2xl font-bold text-white">
                Available Flights ({sortedFlights.length}) {searchParams.tripType === 'round-trip' && '(Outbound + Return)'}
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-400" />
                <Select value={sortOption} onValueChange={setSortOption}>
                  <SelectTrigger className="w-48 bg-white/5 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-asc">
                      <div className="flex items-center"><SortAsc className="mr-2 h-4 w-4" /> Price: Low to High</div>
                    </SelectItem>
                    <SelectItem value="price-desc">
                      <div className="flex items-center"><SortDesc className="mr-2 h-4 w-4" /> Price: High to Low</div>
                    </SelectItem>
                    <SelectItem value="departure-asc">
                      <div className="flex items-center"><SortAsc className="mr-2 h-4 w-4" /> Departure Time</div>
                    </SelectItem>
                    <SelectItem value="duration-asc">
                      <div className="flex items-center"><SortAsc className="mr-2 h-4 w-4" /> Duration</div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-400">Searching for flights...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedFlights.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <p>No flights found. Try adjusting your search.</p>
                  </div>
                ) : (
                  sortedFlights.map((flight) => (
                    <Card
                      key={`${flight.id}-${flight.tripLeg}`}
                      className={`flight-card hover:border-blue-500/30 transition-all duration-300 cursor-pointer ${
                        (searchParams.tripType === 'round-trip' &&
                          ((flight.tripLeg === 'outbound' && selectedOutbound?.id === flight.id) ||
                           (flight.tripLeg === 'return' && selectedReturn?.id === flight.id)))
                          ? 'border-blue-500 ring-2 ring-blue-500/20'
                          : 'border-white/10'
                      }`}
                      onClick={() => handleBookFlight(flight)}
                    >
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1 space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="p-2 bg-blue-500/20 rounded-lg">
                                  <Plane className="h-5 w-5 text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="font-semibold text-white flex items-center">
                                    {flight.flightNumber}
                                    <Badge variant="secondary" className="ml-2 text-xs">
                                      {flight.tripLeg === 'outbound' ? 'Outbound' : 'Return'}
                                    </Badge>
                                  </h3>
                                  <p className="text-sm text-gray-400">{flight.airlineName}</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                <span className="text-sm text-gray-300">4.5</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-400">From</p>
                                <p className="font-medium text-white">{flight.departureAirport} ({flight.departureIata})</p>
                                <p className="text-sm text-gray-400">{formatTime(flight.departureTime)}</p>
                              </div>
                              <div className="text-center">
                                <p className="text-sm text-gray-400">Date</p>
                                <p className="text-lg font-semibold text-white">
                                  {flight.flightDate
                                    ? new Intl.DateTimeFormat('en-IN', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                      }).format(new Date(flight.flightDate))
                                    : 'Invalid date'}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">To</p>
                                <p className="font-medium text-white">{flight.arrivalAirport} ({flight.arrivalIata})</p>
                                <p className="text-sm text-gray-400">{formatTime(flight.arrivalTime)}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-4">
                              <Badge className={getClassColor(searchParams.class)}>
                                {searchParams.class.charAt(0).toUpperCase() + searchParams.class.slice(1)}
                              </Badge>
                              <div className="flex items-center space-x-1 text-sm text-gray-400">
                                <Users className="h-4 w-4" />
                                <span>30+ seats available</span>
                              </div>
                            </div>
                          </div>

                          <div className="lg:text-right space-y-3">
                            <div>
                              <p className="text-sm text-gray-400">Price (est.)</p>
                              <p className="text-3xl font-bold text-white">
                                ₹{flight.price ?? 'N/A'}
                              </p>
                            </div>
                            <Button
                              className="w-full lg:w-auto bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                            >
                              Book {flight.tripLeg === 'outbound' ? 'Outbound' : 'Return'}
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Flights;