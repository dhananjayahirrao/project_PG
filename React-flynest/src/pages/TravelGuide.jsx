// // src/pages/TravelGuide.jsx
import React from 'react';

const TravelGuide = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-16">
      <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 text-center">
        Your Travel Guide
      </h1>

      <p className="text-lg text-gray-300 max-w-2xl text-center mb-12">
        Plan your next adventure with Flynest. Explore top destinations, essential tips, airport guides, and everything you need for a seamless journey.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <img
            src="https://source.unsplash.com/400x300/?travel,destination"
            alt="Popular Destinations"
            className="rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Popular Destinations</h2>
          <p className="text-gray-400">Discover trending travel spots and plan your dream vacation with us.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <img
            src="https://source.unsplash.com/400x300/?travel,tips"
            alt="Travel Tips"
            className="rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Travel Tips</h2>
          <p className="text-gray-400">Get insider tips on packing, visas, airport navigation, and more.</p>
        </div>

        <div className="bg-slate-800 p-6 rounded-xl shadow-lg hover:scale-105 transition-transform">
          <img
            src="https://source.unsplash.com/400x300/?airport,flight"
            alt="Airport Guides"
            className="rounded-lg mb-4"
          />
          <h2 className="text-xl font-semibold mb-2">Airport Guides</h2>
          <p className="text-gray-400">Navigate airports worldwide with our comprehensive terminal and lounge guides.</p>
        </div>
      </div>
    </div>
  );
};

export default TravelGuide;