import React, { useState } from 'react';
import { 
  Heart, 
  Home, 
  Stethoscope, 
  Menu,
  X,
  ArrowRight,
  Users,
  Calendar,
  Shield,
  Star
} from 'lucide-react';
import RehomingForm from '../Rehome/RehomeForm';
import PetStore from '../Adoption/PetStore';
import VetServices from '../VetServices/VetServices';
import StrayCausePage from '../Shelter/Shelter';
import HomePage from '../Landing page/Home';

// ... ServiceCard component remains the same but uses Shield instead of DogBowl
const ServiceCard = ({ title, description, icon: Icon }) => (
  <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-green-500">
    <div className="flex items-center mb-4">
      <div className="bg-yellow-100 p-3 rounded-full">
        <Icon className="w-6 h-6 text-green-600" />
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
    <p className="text-gray-600 mb-4">{description}</p>
    <button className="flex items-center text-green-600 hover:text-green-700 font-medium">
      Learn More 
      <ArrowRight className="ml-2 w-4 h-4" />
    </button>
  </div>
);

const AdoptSection = () => (
  <div className="space-y-6">
    <h2 className="text-2xl font-semibold mb-6">Adopt a Pet</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Available Pets</h3>
        <ul className="space-y-3">
          <li className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-green-600" />
            <span>Dogs: 15 available</span>
          </li>
          <li className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-green-600" />
            <span>Cats: 12 available</span>
          </li>
          <li className="flex items-center">
            <Star className="w-4 h-4 mr-2 text-green-600" />
            <span>Other Pets: 8 available</span>
          </li>
        </ul>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Adoption Process</h3>
        <ol className="list-decimal list-inside space-y-2">
          <li>Fill out application form</li>
          <li>Meet your potential pet</li>
          <li>Home visit assessment</li>
          <li>Adoption finalization</li>
        </ol>
      </div>
    </div>
  </div>
);

// ... RehomeSection, VetSection, and ShelterSection components remain the same

const DashboardSection = () => {
  const services = [
    {
      title: "Adopt a Pet",
      description: "Find your perfect companion and give a loving home to a pet in need.",
      icon: Heart
    },
    {
      title: "Rehome Future",
      description: "Help pets find their forever homes through our rehoming program.",
      icon: Home
    },
    {
      title: "Vet Services",
      description: "Quality healthcare for your beloved pets, provided by experienced professionals.",
      icon: Stethoscope
    },
    {
      title: "Stray Dog Shelter",
      description: "Providing safety, care, and rehabilitation for street animals.",
      icon: Shield
    }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-semibold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {services.map((service, index) => (
          <ServiceCard key={index} {...service} />
        ))}
      </div>
      
      <div className="bg-white rounded-lg p-8 shadow-lg mt-8">
        <h2 className="text-2xl font-semibold mb-8 text-gray-800">Our Impact</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">500+</div>
            <div className="text-gray-600">Pets Adopted</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">1,200+</div>
            <div className="text-gray-600">Animals Treated</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">300+</div>
            <div className="text-gray-600">Successful Rehomings</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const NGODashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSection, setCurrentSection] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'adopt', label: 'Adopt a Pet', icon: Heart },
    { id: 'rehome', label: 'Rehome Future', icon: Users },
    { id: 'vet', label: 'Vet Services', icon: Stethoscope },
    { id: 'shelter', label: 'Stray Dog Shelter', icon: Shield }
  ];

  const renderSection = () => {
    switch(currentSection) {
      case 'adopt':
        return <PetStore />;
      case 'rehome':
        return <RehomingForm />;
      case 'vet':
        return <VetServices />;
      case 'shelter':
        return <StrayCausePage/>;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-green-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-green-600" />
              <span className="text-xl font-bold">PawCare NGO</span>
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setCurrentSection(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentSection === item.id 
                    ? 'bg-green-100 text-green-600' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <div className="p-8">
          {/* Toggle Sidebar Button */}
          {!isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="fixed top-4 left-4 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
          )}
          
          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NGODashboard;