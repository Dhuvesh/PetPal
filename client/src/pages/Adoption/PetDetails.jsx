import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  MapPin, 
  Calendar, 
  Heart, 
  Info, 
  PawPrint, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  AlertTriangle,
  Loader2 
} from "lucide-react";

const NavigationArrow = ({ direction, onClick, disabled }) => {
  const Icon = direction === "next" ? ChevronRight : ChevronLeft;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`absolute top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-md 
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white'} transition-all
        ${direction === "next" ? "right-4" : "left-4"}`}
    >
      <Icon className="w-6 h-6 text-gray-700" />
    </button>
  );
};

const PetTraitBadge = ({ trait }) => {
  const getStatusConfig = (text) => {
    if (text.startsWith("Not") || text.includes("Needed")) {
      return {
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />,
        className: "bg-orange-50 text-orange-700 border-orange-200"
      };
    }
    return {
      icon: <Check className="w-4 h-4 text-green-600" />,
      className: "bg-green-50 text-green-700 border-green-200"
    };
  };

  const { icon, className } = getStatusConfig(trait);

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${className}`}>
      {icon}
      <span className="ml-2">{trait}</span>
    </span>
  );
};

const ImageSlider = ({ photos, petName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  const handleNext = () => {
    if (currentIndex < photos.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setIsLoading(true);
      setImageError(false);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setIsLoading(true);
      setImageError(false);
    }
  };

  const handleImageLoad = () => {
    setIsLoading(false);
    setImageError(false);
  };

  const handleImageError = () => {
    setIsLoading(false);
    setImageError(true);
  };

  return (
    <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
        </div>
      )}
      
      <img
        src={photos[currentIndex]}
        alt={`${petName} ${currentIndex + 1}`}
        className={`w-full h-[600px] object-contain transition-opacity duration-300
          ${isLoading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleImageLoad}
        onError={handleImageError}
      />

      {imageError && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
            <p>Failed to load image</p>
          </div>
        </div>
      )}

      <NavigationArrow 
        direction="previous" 
        onClick={handlePrevious} 
        disabled={currentIndex === 0}
      />
      <NavigationArrow 
        direction="next" 
        onClick={handleNext} 
        disabled={currentIndex === photos.length - 1}
      />
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {photos.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex ? "bg-green-500 w-4" : "bg-green-300"
            }`}
            onClick={() => {
              setCurrentIndex(index);
              setIsLoading(true);
              setImageError(false);
            }}
          />
        ))}
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon: Icon, children }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-xl font-semibold mb-4 flex items-center text-green-700">
      <Icon className="mr-2 w-5 h-5" /> {title}
    </h3>
    {children}
  </div>
);

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="flex items-center space-x-2 text-green-700">
      <Loader2 className="w-6 h-6 animate-spin" />
      <span className="text-xl">Loading pet details...</span>
    </div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center p-4">
    <div className="p-6 bg-red-50 border border-red-200 rounded-lg text-red-700 flex flex-col items-center space-y-2">
      <AlertTriangle className="w-8 h-8" />
      <p className="text-lg font-medium">{message}</p>
    </div>
  </div>
);

const PetDetails = () => {
  const { petId } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      if (!petId) {
        setError('No pet ID provided');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/pet/pet-info/${petId}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch pet details');
        }

        if (!data.success || !data.data) {
          throw new Error('Pet not found');
        }

        console.log("Fetched pet data:", data);
        setPet(data.data);
      } catch (err) {
        console.error('Error fetching pet details:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPetDetails();
  }, [petId]);

  if (loading) return <LoadingSpinner />;
  if (error || !pet) return <ErrorDisplay message={error || 'Pet not found'} />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-700 mb-4">{pet.name}</h1>
        <div className="flex items-center justify-center gap-4">
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <Calendar className="w-4 h-4 mr-2" />
            {pet.age} years
          </span>
          <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
            <MapPin className="w-4 h-4 mr-2" />
            {pet.location}
          </span>
        </div>
      </div>

      {/* Image Slider */}
      {pet.photos && pet.photos.length > 0 && (
        <ImageSlider photos={pet.photos} petName={pet.name} />
      )}

      {/* Pet Traits */}
      {pet.traits && pet.traits.length > 0 && (
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-700 mb-4">Pet Information</h2>
          <div className="flex flex-wrap gap-3">
            {pet.traits.map((trait, index) => (
              <PetTraitBadge key={index} trait={trait} />
            ))}
          </div>
        </div>
      )}

      {/* Pet Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InfoCard title={`About ${pet.name}`} icon={Heart}>
          <p className="text-gray-600 leading-relaxed">{pet.description || 'No description available'}</p>
        </InfoCard>

        {pet.characteristics && pet.characteristics.length > 0 && (
          <InfoCard title="Characteristics" icon={PawPrint}>
            <div className="grid grid-cols-2 gap-3">
              {pet.characteristics.map((characteristic) => (
                <span 
                  key={characteristic}
                  className="text-center py-2 px-4 rounded-full bg-green-50 text-green-700 text-sm font-medium border border-green-200"
                >
                  {characteristic}
                </span>
              ))}
            </div>
          </InfoCard>
        )}
      </div>

      {/* Additional Details */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Weight", value: `${pet.weight} kg` },
            { label: "Breed", value: pet.breed },
            { label: "Gender", value: pet.gender }
          ].map(({ label, value }) => (
            <div key={label} className="text-center p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-700 mb-2">{label}</h4>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Button */}
      <div className="text-center">
        <button className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1">
          Contact About {pet.name}
        </button>
      </div>
    </div>
  );
};

export default PetDetails;