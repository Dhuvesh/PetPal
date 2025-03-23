import axios from 'axios';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place';

// Utility function to validate coordinates
const isValidCoordinates = (lat, lng) => {
  const validLat = !isNaN(lat) && lat >= -90 && lat <= 90;
  const validLng = !isNaN(lng) && lng >= -180 && lng <= 180;
  return validLat && validLng;
};

export const GetVets = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5000 } = req.query;

    // Input validation
    if (!latitude || !longitude) {
      return res.status(400).json({ 
        error: "Missing required parameters: latitude and longitude" 
      });
    }

    if (!isValidCoordinates(parseFloat(latitude), parseFloat(longitude))) {
      return res.status(400).json({ 
        error: "Invalid coordinates provided" 
      });
    }

    // First, search for nearby vet clinics
    const searchResponse = await axios.get(
      `${GOOGLE_PLACES_API}/nearbysearch/json`,
      {
        params: {
          location: `${latitude},${longitude}`,
          radius,
          type: 'veterinary_care',
          key: GOOGLE_API_KEY,
        },
      }
    );

    // Check if the API request was successful
    if (searchResponse.data.status !== 'OK') {
      return res.status(400).json({
        error: searchResponse.data.status,
        message: searchResponse.data.error_message || 'Failed to fetch vet clinics'
      });
    }

    res.json(searchResponse.data);
  } catch (error) {
    console.error('Error in GetVets:', error.response?.data || error.message);
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch vet clinics'
    });
  }
};

export const GetVetById = async (req, res, next) => {
  try {
    const { placeId } = req.params;

    // Input validation
    if (!placeId) {
      return res.status(400).json({
        error: "Missing place ID"
      });
    }

    // Make the API request
    const detailsResponse = await axios.get(
      `${GOOGLE_PLACES_API}/details/json`,
      {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,formatted_phone_number,opening_hours,rating,reviews,photos,website,geometry,price_level,user_ratings_total',
          key: GOOGLE_API_KEY,
        },
      }
    );

    // Check API response status
    if (detailsResponse.data.status !== 'OK') {
      return res.status(detailsResponse.data.status === 'NOT_FOUND' ? 404 : 400).json({
        error: detailsResponse.data.status,
        message: detailsResponse.data.error_message || 'Failed to fetch vet details'
      });
    }

    const vetDetails = detailsResponse.data.result;

    // Transform the response
    const transformedDetails = {
      ...vetDetails,
      photoUrl: vetDetails.photos?.[0] ? 
        `${GOOGLE_PLACES_API}/photo?maxwidth=400&photo_reference=${vetDetails.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : 
        null
    };

    res.json(transformedDetails);
  } catch (error) {
    console.error("Error in GetVetById:", error.response?.data || error.message);
    
    // Handle specific error cases
    if (error.response?.status === 404) {
      return res.status(404).json({
        error: "Not Found",
        message: "Vet clinic not found"
      });
    }

    res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to fetch vet details"
    });
  }
};