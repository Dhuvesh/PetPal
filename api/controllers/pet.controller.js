import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import Pet from '../models/Pet.model.js';
import dotenv from 'dotenv';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

export const addPet = async (req, res, next) => {
  try {
    // Handle multiple files
    const photoUrls = [];
    if (req.files) {
      for (const file of req.files) {
        const uniqueFileName = `pets/${Date.now()}_${file.originalname}`;

        const uploadParams = {
          Bucket: bucketName,
          Key: uniqueFileName,
          Body: file.buffer,
          ContentType: file.mimetype,
        };
        const command = new PutObjectCommand(uploadParams);
        await s3.send(command);

        const photoUrl = `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${uniqueFileName}`;
        photoUrls.push(photoUrl);
      }
    }

    // Process traits and characteristics
    const traits = req.body.traits ? 
      (Array.isArray(req.body.traits) ? req.body.traits : req.body.traits.split(',')) : [];
    const characteristics = req.body.characteristics ? 
      (Array.isArray(req.body.characteristics) ? req.body.characteristics : req.body.characteristics.split(',')) : [];

    const petData = {
      name: req.body.name,
      age: req.body.age,
      location: req.body.location,
      weight: req.body.weight,
      breed: req.body.breed,
      gender: req.body.gender,
      description: req.body.description,
      traits: traits,
      characteristics: characteristics,
      photos: photoUrls || [],
    };

    const pet = await Pet.create(petData);
    res.status(201).json({
      success: true,
      data: pet,
      message: 'Pet added successfully',
    });
  } catch (error) {
    console.error('Error in addPet:', error);
    next(error);
  }
};

export const getPets = async (req, res, next) => {
  try {
    const pets = await Pet.find().sort({ createdAt: -1 });

    const petsWithSignedUrls = await Promise.all(pets.map(async (pet) => {
      const petObject = pet.toObject();

      if (petObject.photos && petObject.photos.length > 0) {
        const signedPhotoUrls = await Promise.all(petObject.photos.map(async (photoUrl) => {
          try {
            const key = photoUrl.split('.amazonaws.com/')[1];
            const getObjectParams = {
              Bucket: bucketName,
              Key: key
            };

            const command = new GetObjectCommand(getObjectParams);
            const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
            return signedUrl;
          } catch (error) {
            console.error('Error generating signed URL:', error);
            return photoUrl; // Return original URL if signing fails
          }
        }));

        petObject.photos = signedPhotoUrls;
      }

      return petObject;
    }));

    res.status(200).json({
      success: true,
      count: petsWithSignedUrls.length,
      data: petsWithSignedUrls
    });
  } catch (error) {
    console.error('Error in getPets:', error);
    next(error);
  }
};

export const getPetById = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);

    if (!pet) {
      return res.status(404).json({
        success: false,
        error: 'Pet not found'
      });
    }

    const petObject = pet.toObject();

    // Generate signed URLs for photos
    if (petObject.photos && petObject.photos.length > 0) {
      const signedPhotoUrls = await Promise.all(petObject.photos.map(async (photoUrl) => {
        try {
          const key = photoUrl.split('.amazonaws.com/')[1];
          const getObjectParams = {
            Bucket: bucketName,
            Key: key
          };

          const command = new GetObjectCommand(getObjectParams);
          const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
          return signedUrl;
        } catch (error) {
          console.error('Error generating signed URL:', error);
          return photoUrl; // Return original URL if signing fails
        }
      }));

      petObject.photos = signedPhotoUrls;
    }

    res.status(200).json({
      success: true,
      data: petObject,
      metadata: {
        name: petObject.name,
        breed: petObject.breed,
        location: petObject.location,
        photoCount: petObject.photos.length
      }
    });
  } catch (error) {
    console.error('Error in getPetById:', error);
    
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        error: 'Invalid pet ID format'
      });
    }
    
    next(error);
  }
};

export const nearbyVets = async (req, res) => {
  const { lat, lng } = req.query;

  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=5000&type=veterinary_care&key=AIzaSyAElPU8uvHbXKzEHYMQODEJ7ABedfaCdN8`
    );
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch clinics', error: error.message });
  }
};