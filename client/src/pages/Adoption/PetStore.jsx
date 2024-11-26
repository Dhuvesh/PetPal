import React, { useState, useMemo, useEffect } from 'react';
import { MapPin, Search, X, Filter, Loader2, PawPrint } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PetCard = ({ petId, name, photos, age, location, breed }) => {
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);

  const handleCardClick = () => {
    navigate(`/adopt/${petId}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] overflow-hidden">
      <div className="relative">
        {imageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-50">
            <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
          </div>
        )}
        <img 
          src={photos?.[0] || '/api/placeholder/400/320'} 
          alt={name} 
          className="w-full h-52 object-contain transition-transform duration-300"
          onLoad={() => setImageLoading(false)}
          style={{ display: imageLoading ? 'none' : 'block' }}
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-2xl font-bold text-green-600 capitalize">{name}</h3>
          <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
            {age}
          </span>
        </div>
        <p className="text-gray-600 font-semibold capitalize mb-3">{breed}</p>
        <div className="flex items-center gap-2 text-gray-500 mb-4">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">{location}</span>
        </div>
        <button
          onClick={handleCardClick}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 font-medium"
        >
          Meet {name}
        </button>
      </div>
    </div>
  );
};

const Sidebar = ({ 
  onCategoryChange, 
  onSearch, 
  onLocationChange, 
  selectedCategories, 
  selectedLocation, 
  onClearFilters,
  locations,
  categories
}) => (
  <div className="bg-green-50 p-6 h-full border-r border-green-100">
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-green-700 mb-6">Filters</h2>
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search pets..."
            onChange={onSearch}
            className="w-full pl-10 pr-4 py-3 bg-white border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-green-700 font-medium mb-2">Location</label>
        <select
          onChange={onLocationChange}
          value={selectedLocation}
          className="w-full px-4 py-3 bg-white border border-green-200 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 appearance-none"
        >
          <option value="">All Locations</option>
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {categories?.length > 0 && (
        <div>
          <label className="block text-green-700 font-medium mb-2">Pet Type</label>
          <div className="space-y-2">
            {categories.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => onCategoryChange(category)}
                  className="w-4 h-4 text-green-500 border-green-300 rounded focus:ring-green-500"
                />
                <span className="text-gray-700 capitalize">{category}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <button
        onClick={onClearFilters}
        className="w-full mt-4 bg-yellow-500 hover:bg-yellow-600 text-white py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 font-medium"
      >
        <X className="w-4 h-4" />
        Clear Filters
      </button>
    </div>
  </div>
);

const PetStore = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');

  const locations = useMemo(() => {
    return [...new Set(pets.map(pet => pet.location))].sort();
  }, [pets]);

  useEffect(() => {
    const uniqueCategories = [...new Set(pets.map(pet => pet.category))];
    setCategories(uniqueCategories);
    setSelectedCategories(uniqueCategories);
  }, [pets]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch('/api/pet/pet-info');
        if (!response.ok) {
          throw new Error('Failed to fetch pets');
        }
        const data = await response.json();
        setPets(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleLocationChange = (e) => {
    setSelectedLocation(e.target.value);
  };

  const handleClearFilters = () => {
    setSelectedCategories(categories);
    setSearchTerm('');
    setSelectedLocation('');
  };

  const filteredPets = useMemo(() => {
    return pets.filter(pet => 
      selectedCategories.includes(pet.category) &&
      (pet.name.toLowerCase().includes(searchTerm) ||
       pet.breed.toLowerCase().includes(searchTerm)) &&
      (selectedLocation === '' || pet.location === selectedLocation)
    );
  }, [pets, selectedCategories, searchTerm, selectedLocation]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 text-green-500 animate-spin" />
          <span className="text-xl text-green-700">Loading pets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <div className="text-xl text-red-600 flex items-center gap-2">
          <X className="w-6 h-6" />
          Error: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-green-50">
      <div className="w-1/4">
        <Sidebar
          onCategoryChange={handleCategoryChange}
          onSearch={handleSearch}
          onLocationChange={handleLocationChange}
          selectedCategories={selectedCategories}
          selectedLocation={selectedLocation}
          onClearFilters={handleClearFilters}
          locations={locations}
          categories={categories}
        />
      </div>
      <div className="w-3/4 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-green-700"><PawPrint className="w-10 h-10 inline-block " /> Find Your Perfect Pet </h1>
          <div className="text-gray-600">
            {filteredPets.length} pets available
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <PetCard 
              key={pet._id} 
              petId={pet._id}
              name={pet.name}
              photos={pet.photos}
              age={pet.age}
              location={pet.location}
              breed={pet.breed}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PetStore;