import React, { useState, useCallback } from 'react';
import { PawPrint, MapPin, Info, User, Image as ImageIcon, X, Weight, Dog, List, AlertTriangle } from 'lucide-react';

const RehomingForm = () => {
  const initialPetDetails = {
    name: '',
    age: '',
    location: '',
    weight: '',
    breed: '',
    gender: '',
    description: '',
    traits: [],
    characteristics: [],
  };

  const [petDetails, setPetDetails] = useState(initialPetDetails);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [uploadError, setUploadError] = useState('');
  const [photos, setPhotos] = useState([]);
  const [photoFiles, setPhotoFiles] = useState([]);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setPetDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleTraitChange = useCallback((trait) => {
    setPetDetails(prev => ({
      ...prev,
      traits: prev.traits.includes(trait)
        ? prev.traits.filter(t => t !== trait)
        : [...prev.traits, trait],
    }));
  }, []);

  const handleCharacteristicChange = useCallback((characteristic) => {
    setPetDetails(prev => ({
      ...prev,
      characteristics: prev.characteristics.includes(characteristic)
        ? prev.characteristics.filter(c => c !== characteristic)
        : [...prev.characteristics, characteristic],
    }));
  }, []);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const maxPhotos = 5;
    const remainingSlots = maxPhotos - photos.length;

    if (files.length > remainingSlots) {
      setUploadError(`You can only upload ${remainingSlots} more photo${remainingSlots !== 1 ? 's' : ''}.`);
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/jpeg', 'image/png', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setUploadError('Some files were rejected. Please only upload JPG, PNG or WebP images under 5MB.');
      return;
    }

    const newPhotoFiles = [...photoFiles, ...validFiles];
    setPhotoFiles(newPhotoFiles);

    // Create preview URLs
    const newPhotos = validFiles.map(file => URL.createObjectURL(file));
    setPhotos(prev => [...prev, ...newPhotos]);
    setUploadError('');
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const requiredFields = ['name', 'age', 'location', 'weight', 'breed', 'gender', 'description'];
    for (const field of requiredFields) {
      if (!petDetails[field]) {
        setSubmitStatus({
          type: 'error',
          message: `Please fill in the ${field.charAt(0).toUpperCase() + field.slice(1)} field`
        });
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
  
    setIsSubmitting(true);
    setSubmitStatus({ type: '', message: '' });
  
    try {
      const formData = new FormData();
  
      // Iterate through petDetails and append fields correctly
      Object.entries(petDetails).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          // Append array fields as comma-separated strings
          formData.append(key, value.join(','));
        } else {
          formData.append(key, value);
        }
      });
  
      photoFiles.forEach(photo => {
        formData.append('photos', photo);
      });
  
      const response = await fetch('/api/pet/add-pet', {
        method: 'POST',         
        body: formData,
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit pet details');
      }
  
      setSubmitStatus({
        type: 'success',
        message: 'Pet details submitted successfully!'
      });
  
      // Reset form
      setPetDetails(initialPetDetails);
      setPhotos([]);
      setPhotoFiles([]);
  
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({
        type: 'error',
        message: error.message || 'Failed to submit pet details. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto my-8 p-8 bg-amber-50 rounded-lg shadow-lg">
      <div className="flex items-center gap-2 mb-6">
        <PawPrint className="text-amber-800 w-8 h-8" />
        <h2 className="text-3xl font-bold text-amber-800">Rehome Your Pet</h2>
      </div>

      {/* Status Messages */}
      {submitStatus.message && (
        <div className={`mb-6 p-4 rounded-lg flex items-start gap-2 ${
          submitStatus.type === 'error' 
            ? 'bg-red-50 border border-red-200 text-red-800' 
            : 'bg-green-50 border border-green-200 text-green-800'
        }`}>
          {submitStatus.type === 'error' && <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />}
          <p>{submitStatus.message}</p>
        </div>
      )}

      {uploadError && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <p>{uploadError}</p>
        </div>
      )}

      <p className="text-amber-700 mb-8 italic">
        Help your pet find their perfect new home with our rehoming service.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="name">
              <User className="w-4 h-4" />
              Pet Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={petDetails.name}
              onChange={handleChange}
              required
              className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.name ? 'border-red-500' : ''}`}
              placeholder="Enter pet's name"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="age">
              <Info className="w-4 h-4" />
              Age
            </label>
            <input
              type="text"
              id="age"
              name="age"
              value={petDetails.age}
              onChange={handleChange}
              required
              className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.age ? 'border-red-500' : ''}`}
              placeholder="Enter pet's age"
            />
          </div>
        </div>

        {/* Location Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="location">
            <MapPin className="w-4 h-4" />
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={petDetails.location}
            onChange={handleChange}
            required
            className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.location ? 'border-red-500' : ''}`}
            placeholder="Enter your location"
          />
        </div>

        {/* Weight Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="weight">
            <Weight className="w-4 h-4" />
            Weight (lbs)
          </label>
          <input
            type="number"
            id="weight"
            name="weight"
            value={petDetails.weight}
            onChange={handleChange}
            required
            className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.weight ? 'border-red-500' : ''}`}
            placeholder="Enter pet's weight"
          />
        </div>

        {/* Breed and Gender Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="breed">
              <Dog className="w-4 h-4" />
              Breed
            </label>
            <input
              type="text"
              id="breed"
              name="breed"
              value={petDetails.breed}
              onChange={handleChange}
              required
              className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.breed ? 'border-red-500' : ''}`}
              placeholder="Enter pet's breed"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="gender">
              <List className="w-4 h-4" />
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={petDetails.gender}
              onChange={handleChange}
              required
              className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.gender ? 'border-red-500' : ''}`}>
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
        </div>

        {/* Description Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-amber-800 font-medium" htmlFor="description">
            <Info className="w-4 h-4" />
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={petDetails.description}
            onChange={handleChange}
            required
            className={`w-full p-3 border border-amber-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all ${submitStatus.type === 'error' && !petDetails.description ? 'border-red-500' : ''}`}
            placeholder="Tell us about your pet"
            rows={4}
          />
        </div>

        {/* Traits Section */}
        <div className="space-y-2">
          <p className="text-amber-800 font-medium">Traits</p>
          <div className="flex gap-4 flex-wrap">
            {['Not Spayed', 'Shots Up to Date', 'Training Needed', 'Good with Cats', 'Good with Dogs', 'Good with Kids'].map((trait) => (
              <label key={trait} className="flex items-center">
                <input
                  type="checkbox"
                  checked={petDetails.traits.includes(trait)}
                  onChange={() => handleTraitChange(trait)}
                  className="mr-2"
                />
                {trait}
              </label>
            ))}
          </div>
        </div>

        {/* Characteristics Section */}
        <div className="space-y-2">
          <p className="text-amber-800 font-medium">Characteristics</p>
          <div className="flex gap-4 flex-wrap">
            {[ 'Friendly', 'Playful', 'Trained', 'Healthy'].map((characteristic) => (
              <label key={characteristic} className="flex items-center">
                <input
                  type="checkbox"
                  checked={petDetails.characteristics.includes(characteristic)}
                  onChange={() => handleCharacteristicChange(characteristic)}
                  className="mr-2"
                />
                {characteristic}
              </label>
            ))}
          </div>
        </div>

        {/* Photo Upload Section */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-amber-800 font-medium">
            <ImageIcon className="w-4 h-4" />
            Upload Photos (max: 5)
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handlePhotoUpload}
            className="border border-amber-200 rounded-lg p-2 w-full"
          />
          <div className="flex flex-wrap mt-2">
            {photos.map((photo, index) => (
              <div key={index} className="relative mr-2 mb-2">
                <img src={photo} alt={`Pet Preview ${index + 1}`} className="w-24 h-24 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full p-3 rounded-lg bg-amber-600 text-white font-semibold transition-all ${isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-500'}`}
        >
          {isSubmitting ? 'Submitting...' : 'Rehome My Pet'}
        </button>
      </form>
    </div>
  );
};

export default RehomingForm;
