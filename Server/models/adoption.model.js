import mongoose from "mongoose";

const adoptionSchema = new mongoose.Schema(
  {
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    // Personal Information
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    occupation: {
      type: String,
      required: true,
      trim: true,
    },
    // Living Situation
    housingType: {
      type: String,
      enum: ["apartment", "house", "townhouse", "rural", "other"],
      required: true,
    },
    ownRent: {
      type: String,
      enum: ["own", "rent"],
      required: true,
    },
    hasChildren: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
    childrenAges: {
      type: String,
      default: "",
    },
    // Pet Experience
    hasPets: {
      type: String,
      enum: ["yes", "no"],
      required: true,
    },
    currentPets: {
      type: String,
      default: "",
    },
    experience: {
      type: String,
      required: true,
    },
    // Adoption Details
    reasonForAdopting: {
      type: String,
      required: true,
    },
    careArrangements: {
      type: String,
      required: true,
    },
    // Admin Fields
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "withdrawn"],
      default: "pending",
    },
    adminNotes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Create indexes for common queries
adoptionSchema.index({ status: 1 });
adoptionSchema.index({ petId: 1 });
adoptionSchema.index({ createdAt: -1 });
adoptionSchema.index({ fullName: "text", email: "text" });

const Adoption = mongoose.model("Adoption", adoptionSchema);

export default Adoption;