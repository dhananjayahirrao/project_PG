
import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Plane, Search, Shield, Clock, Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find the best flights with our intelligent search engine'
    },
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your payments and data are protected with bank-level security'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your travel needs'
    },
    {
      icon: Star,
      title: 'Best Prices',
      description: 'Competitive prices and exclusive deals on flights worldwide'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Flynest - Your Gateway to the Skies | Flight Booking Made Easy</title>
        <meta name="description" content="Book flights easily with Flynest. Compare prices, choose your seats, and manage your bookings all in one place. Your trusted flight booking partner." />
      </Helmet>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-slate-900/20"></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <h1 className="text-5xl md:text-7xl font-bold">
                  <span className="gradient-text">Fly Beyond</span>
                  <br />
                  <span className="text-white">Your Dreams</span>
                </h1>
                
                <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                  Discover the world with Flynest. Book flights, choose your perfect seat, 
                  and manage your journey with ease.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              >
                {isAuthenticated ? (
                  <Link to="/flights">
                    <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                      <Search className="mr-2 h-5 w-5" />
                      Search Flights
                    </Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/register">
                      <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </Link>
                    <Link to="/flights">
                      <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-white/20 text-white hover:bg-white/10">
                        Browse Flights
                      </Button>
                    </Link>
                  </>
                )}
              </motion.div>
            </div>

            {/* Floating Plane Animation */}
            <motion.div
              className="absolute top-1/2 right-10 hidden lg:block"
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Plane className="h-24 w-24 text-blue-400 opacity-20" />
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center space-y-4 mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Why Choose <span className="gradient-text">Flynest?</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Experience the future of flight booking with our cutting-edge platform
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="glass-effect rounded-xl p-6 text-center space-y-4 hover:border-blue-500/30 transition-all duration-300"
                >
                  <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="glass-effect rounded-2xl p-12 space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Take Off?
              </h2>
              <p className="text-xl text-gray-300">
                Join thousands of travelers who trust Flynest for their journey
              </p>
              {!isAuthenticated && (
                <Link to="/register">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-lg px-8 py-6">
                    Start Your Journey
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              )}
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home;
