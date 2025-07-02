import Adoption from "../models/adoption.model.js"
import Pet from "../models/pet.model.js"
import { createChatForAdoption } from "./chat.controller.js"

/**
 * Submit a new adoption request
 * @route POST /api/adoptions/submit-request
 * @access Public
 */
const submitAdoptionRequest = async (req, res) => {
  try {
    const {
      petId,
      fullName,
      email,
      phone,
      address,
      occupation,
      housingType,
      ownRent,
      hasChildren,
      childrenAges,
      hasPets,
      currentPets,
      experience,
      reasonForAdopting,
      careArrangements,
    } = req.body

    // Validate required fields
    if (!petId || !fullName || !email || !phone || !address || !reasonForAdopting) {
      return res.status(400).json({ message: "Missing required fields" })
    }

    // Check if pet exists
    const pet = await Pet.findById(petId)
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" })
    }

    // Create adoption request (with default status "pending")
    const newAdoption = new Adoption({
      petId,
      fullName,
      email,
      phone,
      address,
      occupation,
      housingType,
      ownRent,
      hasChildren,
      childrenAges: hasChildren === "yes" ? childrenAges : "",
      hasPets,
      currentPets: hasPets === "yes" ? currentPets : "",
      experience,
      reasonForAdopting,
      careArrangements,
      status: "pending",
      adminNotes: "",
    })

    await newAdoption.save()

    res.status(201).json({
      message: "Adoption request submitted successfully",
      adoptionId: newAdoption._id,
    })
  } catch (error) {
    console.error("Error in submitAdoptionRequest:", error)
    res.status(500).json({ message: "Failed to submit adoption request", error: error.message })
  }
}

/**
 * Get all adoption requests with pagination
 * @route GET /api/adoptions/get-requests
 * @access Admin
 */
const getAdoptionRequests = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const status = req.query.status
    const search = req.query.search

    const filter = {}
    if (status && ["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      filter.status = status
    }

    if (search) {
      filter.$or = [{ fullName: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }]
    }

    const total = await Adoption.countDocuments(filter)

    const adoptions = await Adoption.find(filter).populate("petId").sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.status(200).json(adoptions)
  } catch (error) {
    console.error("Error in getAdoptionRequests:", error)
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message })
  }
}

/**
 * Get a specific adoption request by ID
 * @route GET /api/adoptions/get-request/:id
 * @access Admin
 */
const getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate("petId")
    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" })
    }
    res.status(200).json(adoption)
  } catch (error) {
    console.error("Error in getAdoptionById:", error)
    res.status(500).json({ message: "Error fetching adoption details", error: error.message })
  }
}

/**
 * Update adoption request status
 * @route PUT /api/adoptions/update-status/:id
 * @access Admin
 */
export const updateAdoptionStatusWithChat = async (req, res) => {
  try {
    const { id } = req.params
    const { status, adminNotes } = req.body

    console.log("Updating adoption status:", id, "to:", status)

    // Validate status
    if (!["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    const adoption = await Adoption.findByIdAndUpdate(
      id,
      {
        status,
        adminNotes: adminNotes || "",
        updatedAt: Date.now(),
      },
      { new: true },
    ).populate("petId")

    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" })
    }

    console.log("Adoption status updated successfully")

    // If the adoption was approved, update pet status and create chat
    if (status === "approved") {
      try {
        console.log("Processing approved adoption - updating pet and creating chat")

        // Update pet status
        await Pet.findByIdAndUpdate(adoption.petId._id, {
          adoptionStatus: "adopted",
          adoptedBy: adoption._id,
        })
        console.log("Pet status updated to adopted")

        // Create chat for buyer and seller immediately
        try {
          const chat = await createChatForAdoption(adoption._id)
          console.log("Chat created successfully for adoption:", adoption._id, "Chat ID:", chat._id)
        } catch (chatError) {
          console.error("Error creating chat:", chatError)
          // Don't fail the adoption approval if chat creation fails
          console.log("Adoption approved but chat creation failed - user can retry chat creation later")
        }
      } catch (updateError) {
        console.error("Error updating pet status:", updateError)
        // Continue with the response even if pet update fails
      }
    }

    res.status(200).json({
      message: `Adoption request ${status} successfully`,
      adoption,
    })
  } catch (error) {
    console.error("Error in updateAdoptionStatus:", error)
    res.status(500).json({ message: "Failed to update adoption status", error: error.message })
  }
}

/**
 * Get adoption statistics for dashboard
 * @route GET /api/adoptions/stats
 * @access Admin
 */
const getAdoptionStats = async (req, res) => {
  try {
    const stats = await Adoption.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ])

    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      withdrawn: 0,
    }

    stats.forEach((item) => {
      formattedStats[item._id] = item.count
      formattedStats.total += item.count
    })

    res.status(200).json(formattedStats)
  } catch (error) {
    console.error("Error in getAdoptionStats:", error)
    res.status(500).json({ message: "Error fetching adoption statistics", error: error.message })
  }
}

/**
 * Get adoption requests for a specific user
 * @route GET /api/adoptions/get-user-requests
 * @access User
 */
const getUserAdoptionRequests = async (req, res) => {
  try {
    const page = Number.parseInt(req.query.page) || 1
    const limit = Number.parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const status = req.query.status
    const search = req.query.search
    const userEmail = req.query.email

    if (!userEmail) {
      return res.status(400).json({ message: "User email is required" })
    }

    const filter = { email: userEmail }

    if (status && ["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      filter.status = status
    }

    if (search) {
      const pets = await Pet.find({ name: { $regex: search, $options: "i" } })
      const petIds = pets.map((pet) => pet._id)
      filter.petId = { $in: petIds }
    }

    const total = await Adoption.countDocuments(filter)

    const adoptions = await Adoption.find(filter).populate("petId").sort({ createdAt: -1 }).skip(skip).limit(limit)

    res.set("X-Total-Count", total.toString())
    res.status(200).json(adoptions)
  } catch (error) {
    console.error("Error in getUserAdoptionRequests:", error)
    res.status(500).json({ message: "Error fetching user adoption requests", error: error.message })
  }
}

/**
 * Allow user to withdraw their adoption request
 * @route PUT /api/adoptions/withdraw-request/:id
 * @access User
 */
const withdrawAdoptionRequest = async (req, res) => {
  try {
    const { id } = req.params
    const userEmail = req.query.email || req.body.email

    const adoption = await Adoption.findById(id)
    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" })
    }

    if (adoption.email !== userEmail) {
      return res.status(403).json({ message: "You can only withdraw your own adoption requests" })
    }

    if (adoption.status !== "pending") {
      return res.status(400).json({ message: "Only pending requests can be withdrawn" })
    }

    const updatedAdoption = await Adoption.findByIdAndUpdate(
      id,
      {
        status: "withdrawn",
        updatedAt: Date.now(),
      },
      { new: true },
    ).populate("petId")

    res.status(200).json({
      message: "Adoption request withdrawn successfully",
      adoption: updatedAdoption,
    })
  } catch (error) {
    console.error("Error in withdrawAdoptionRequest:", error)
    res.status(500).json({ message: "Failed to withdraw adoption request", error: error.message })
  }
}

export {
  submitAdoptionRequest,
  getAdoptionRequests,
  getAdoptionById,
  getAdoptionStats,
  getUserAdoptionRequests,
  withdrawAdoptionRequest,
}
