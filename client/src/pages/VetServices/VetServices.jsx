  import React, { useState } from 'react';
  import {  CheckCircle, AlertTriangle, Map, Search, Navigation } from 'lucide-react';

  const VetFinder = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [clinics, setClinics] = useState([]);
    const [locationStatus, setLocationStatus] = useState('');

    const searchNearbyVets = async (latitude, longitude) => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/pet/nearby-vets?lat=${latitude}&lng=${longitude}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch nearby clinics');
        }

        const data = await response.json();
        const formattedClinics = data.results.map(clinic => ({
          id: clinic.place_id,
          name: clinic.name,
          address: clinic.vicinity,
          rating: clinic.rating || 'No rating',
          openNow: clinic.opening_hours?.open_now,
          distance: calculateDistance(
            latitude,
            longitude,
            clinic.geometry.location.lat,
            clinic.geometry.location.lng
          )
        }));

        setClinics(formattedClinics);
      } catch (err) {
        setError('Failed to fetch nearby clinics: ' + err.message);
      }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 3959; // Earth's radius in miles
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c;
      return distance.toFixed(1) + ' miles';
    };

    const getLocation = () => {
      setLoading(true);
      setError('');
      setLocationStatus('Requesting location access...');

      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        setLoading(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocationStatus('Location access granted');
          await searchNearbyVets(
            position.coords.latitude,
            position.coords.longitude
          );
          setLoading(false);
        },
        (error) => {
          setLoading(false);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('Location permission denied');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('Location information unavailable');
              break;
            case error.TIMEOUT:
              setError('Location request timed out');
              break;
            default:
              setError('An unknown error occurred');
          }
        }
      );
    };

    return (
      <div className="w-full h-full mx-auto p-8 bg-gradient-to-r from-yellow-300 to-green-400">
      <div className="bg-white shadow-lg rounded-lg">
        <div className="bg-green-600 text-white py-4 px-6 rounded-t-lg flex items-center">
          <Map className="mr-2" />
          <h1 className="text-2xl font-bold">Find Nearby Vet Clinics</h1>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <Search className="mr-2 text-gray-500" />
              <input
                type="text"
                placeholder="Enter your location"
                className="bg-gray-100 border-none focus:ring-0 focus:border-none rounded-full py-2 px-4 w-64"
              />
            </div>
            <button
              onClick={getLocation}
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full flex items-center"
            >
              <Navigation className="mr-2" />
              {loading ? 'Getting Location...' : 'Find Nearby Clinics'}
            </button>
          </div>

          {locationStatus && (
            <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
              <CheckCircle className="mr-2" />
              <p>{locationStatus}</p>
            </div>
          )}

          {error && (
            <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-center">
              <AlertTriangle className="mr-2" />
              <p>{error}</p>
            </div>
          )}

          {clinics.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clinics.map((clinic) => (
                <div
                  key={clinic.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition-shadow bg-white"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold text-green-600">{clinic.name}</h2>
                      <p className="text-gray-600">{clinic.address}</p>
                      <p className="text-sm text-gray-500">{clinic.distance}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        Rating: {clinic.rating}
                      </div>
                      <div className="text-sm text-gray-500">
                        {clinic.openNow ? 'Open Now' : 'Closed'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    );
  };

  export default VetFinder;