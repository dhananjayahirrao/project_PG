// import React from 'react';
// import Footer from '../components/Layout/Footer';

// const About = () => {
//   return (
//     <>
//       <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
//         <h1 className="text-4xl font-bold text-white mb-4">About Flynest</h1>
//         <p className="text-lg text-gray-300 max-w-2xl">
//           Flynest is your trusted partner for seamless flight booking and travel management.
//           We simplify travel with innovative technology and excellent service.
//         </p>
//       </div>

//       <Footer />
//     </>
//   );
// };

// export default About;
import React from 'react';
import Footer from '../components/Layout/Footer';

const About = () => {
  return (
    <>
      {/* Banner image */}
      <div className="w-full h-[300px] md:h-[400px] bg-cover bg-center" 
        style={{ backgroundImage: 'url("/public/images/Aboutus.jpg")' }}>
      </div>

      <div className="flex flex-col items-center justify-center py-10 px-4 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-center">
        <h1 className="text-5xl font-extrabold text-white mb-6">About <span className="text-indigo-400">Flynest</span></h1>
        <p className="text-lg text-gray-300 max-w-3xl leading-relaxed mb-8">
          Flynest is a modern online platform designed to make air travel simple, affordable, and enjoyable.
          With an extensive network of domestic and international flights, Flynest empowers travelers to book, manage,
          and enhance their journeys effortlessly through cutting-edge technology.
        </p>

        <h2 className="text-4xl font-bold text-white mb-4">Our Mission</h2>
        <p className="text-lg text-gray-300 max-w-3xl leading-relaxed">
          At Flynest, our mission is to redefine the way people experience air travel. We combine seamless booking systems, 
          personalized services, and innovative tools to provide an unmatched level of convenience and trust.
          Whether you're a frequent flyer or planning your first trip, Flynest is here to ensure a smooth journey from start to finish.
        </p>
      </div>

      
    </>
  );
};

export default About;