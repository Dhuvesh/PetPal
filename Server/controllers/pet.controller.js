import cloudinary from "../lib/cloudinary.js"
import Pet from "../models/pet.model.js"

const GetPet = async (req, res) => {
  try {
    const pets = await Pet.find({})
    res.status(200).json(pets)
  } catch (error) {
    console.error("Error in GetPet controller:", error)
    res.status(500).json({ message: "Error fetching pets", error: error.message })
  }
}

const GetPetById = async (req, res) => {
  try {
    const pet = await Pet.findById(req.params.id)
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }
    res.status(200).json(pet)
  } catch (error) {
    console.error("Error in GetPetById controller:", error)
    res.status(500).json({ message: "Error fetching pet details", error: error.message })
  }
}

const PostPet = async (req, res) => {
  try {
    // Parse pet information
    const { 
      name, age, location, weight, breed, gender, description, traits, characteristics,
      // Owner information
      fullName, email, phone, address, reason
    } = req.body

    // Parse traits and characteristics from JSON strings to arrays
    const parsedTraits = typeof traits === 'string' ? JSON.parse(traits || "[]") : traits
    const parsedCharacteristics = typeof characteristics === 'string' ? JSON.parse(characteristics || "[]") : characteristics

    // Upload photos to Cloudinary
    const photoUrls = []
    for (let i = 0; i < 5; i++) {
      const photoField = `photo${i}`
      if (req.files && req.files[photoField] && req.files[photoField][0]) {
        try {
          const result = await cloudinary.uploader.upload(req.files[photoField][0].path, {
            folder: "pet-rehoming",
          })
          photoUrls.push(result.secure_url)
        } catch (uploadError) {
          console.error(`Error uploading photo ${i}:`, uploadError)
        }
      }
    }

    // Validate required fields
    if (!name || !age || !location || !weight || !breed || !gender || !description || 
        parsedTraits.length === 0 || parsedCharacteristics.length === 0 || photoUrls.length === 0 ||
        !fullName || !email || !phone || !address || !reason) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    const newPet = new Pet({
      // Pet details
      name,
      age,
      location,
      weight,
      breed,
      gender,
      description,
      traits: parsedTraits,
      characteristics: parsedCharacteristics,
      photos: photoUrls,
      
      // Owner details
      owner: {
        fullName,
        email,
        phone,
        address,
        reason
      }
    })

    await newPet.save()

    res.status(201).json({ message: "Pet rehoming request submitted successfully", pet: newPet })
  } catch (error) {
    console.error("Error in postPet:", error)
    res.status(500).json({ message: "Failed to submit pet rehoming request", error: error.message })
  }
}

export { GetPet, GetPetById, PostPet }