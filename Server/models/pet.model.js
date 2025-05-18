import mongoose from "mongoose"

const petSchema = new mongoose.Schema(
  {
    // Pet details
    name: { type: String, required: true },
    age: { type: String, required: true },
    location: { type: String, required: true },
    weight: { type: String, required: true },
    breed: { type: String, required: true },
    gender: { type: String, required: true },
    description: { type: String, required: true },
    traits: { type: [String], required: true },
    characteristics: { type: [String], required: true },
    photos: { type: [String], required: true },
    
    // Owner details
    owner: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      reason: { type: String, required: true }
    }
  },
  { timestamps: true }
)

const Pet = mongoose.model("Pet", petSchema)

export default Pet