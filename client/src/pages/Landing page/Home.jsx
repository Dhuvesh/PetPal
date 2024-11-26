import React, { useState, useEffect } from 'react';

import { Search, Heart, Info, ArrowRight, PawPrint, Home, Stethoscope, Shield } from 'lucide-react';

const HomePage = () => {
  const featuredPets = [
    { id: 1, name: 'Buddy', type: 'Dog', age: '2 years', image: '../../src/assets/images/dog.jpg' },
    { id: 2, name: 'Whiskers', type: 'Cat', age: '1 year', image: '../../src/assets/images/cat.jpg' },
    { id: 3, name: 'Hoppy', type: 'Rabbit', age: '6 months', image: '../../src/assets/images/rabbit.jpg' },
  ];

  const services = [
    { 
      title: "Adopt a Pet", 
      description: "Find your perfect companion and give a loving home to a pet in need.",
      icon: PawPrint,
      link: "/adopt"
    },
    { 
      title: "Rehome Future", 
      description: "Help pets find their forever homes through our rehoming program.",
      icon: Home,
      link: "/rehome"
    },
    { 
      title: "Vet Services", 
      description: "Quality healthcare for your beloved pets, provided by experienced professionals.",
      icon: Stethoscope,
      link: "/vet-services"
    },
    { 
      title: "Stray Dog Shelter", 
      description: "Providing safety, care, and rehabilitation for street animals.",
      icon: Shield,
      link: "/stray-shelter"
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % services.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-yellow-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-yellow-300 to-green-400 pt-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 text-left mb-8 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-bold text-green-800 mb-4 leading-tight">Find Your <span className="text-yellow-600">Furry</span> Soulmate</h1>
            <p className="text-xl text-green-700 mb-8">Every pet deserves a loving home. Start your journey to find your perfect companion today.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="/adopt" className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors inline-flex items-center justify-center">
                <Search className="mr-2" size={20} />
                Find a Pet
              </a>
              <a href="/about" className="bg-yellow-500 text-green-800 px-8 py-3 rounded-full text-lg font-semibold hover:bg-yellow-600 transition-colors inline-flex items-center justify-center">
                <Info className="mr-2" size={20} />
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 ">
            <img src="../../src/assets/images/adorable-fluffy-golden-retriever-puppy-showing-its-tongue.png" alt="Happy pets" className="rounded-lg  " />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-800 mb-12 text-center">Our <span className="text-yellow-500">Services</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-green-50 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
                <service.icon className="text-green-600 w-12 h-12 mb-4" />
                <h3 className="text-2xl font-semibold text-green-700 mb-2">{service.title}</h3>
                <p className="text-green-600 mb-4">{service.description}</p>
                <a href={service.link} className="text-yellow-600 hover:text-yellow-700 font-medium inline-flex items-center">
                  Learn More
                  <ArrowRight className="ml-2" size={16} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Pets Section */}
      <section className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-green-800 mb-12 text-center">Meet Our <span className="text-yellow-500">Adorable</span> Friends</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredPets.map((pet) => (
              <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
                <img src={pet.image} alt={pet.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-2xl font-semibold text-green-700 mb-2">{pet.name}</h3>
                  <p className="text-gray-600 mb-4">{pet.type} • {pet.age}</p>
                  <a href={`/pet/${pet.id}`} className="text-green-600 hover:text-green-700 font-medium inline-flex items-center">
                    Meet {pet.name}
                    <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <a href="/all-pets" className="text-green-600 hover:text-green-700 font-semibold text-lg inline-flex items-center">
              View All Pets
              <ArrowRight className="ml-2" size={20} />
            </a>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-green-400 to-yellow-300 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-green-800 mb-4">Ready to Bring Home Your New Best Friend?</h2>
          <p className="text-xl text-green-700 mb-8">Open your heart and home to a furry friend today</p>
          <a href="/adopt" className="bg-white text-green-700 px-10 py-4 rounded-full text-xl font-semibold hover:bg-green-50 transition-colors inline-flex items-center justify-center shadow-lg">
            <Heart className="mr-3" size={24} />
            Start Your Adoption Journey
          </a>
        </div>
      </section>
    </div>
  );
};

export default HomePage;