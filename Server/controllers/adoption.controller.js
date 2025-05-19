import Adoption from "../models/adoption.model.js";
import Pet from "../models/pet.model.js";
// import { sendEmail } from "../utils/emailService.js" // Implement this later for email notifications

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
    } = req.body;

    // Validate required fields
    if (!petId || !fullName || !email || !phone || !address || !reasonForAdopting) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if pet exists
    const pet = await Pet.findById(petId);
    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
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
      status: "pending", // Default status
      adminNotes: "",    // Empty admin notes initially
    });

    await newAdoption.save();

    // Optional: Send email notifications
    // - To admin
    // - To the person who submitted the adoption request
    // try {
    //   await sendEmail({
    //     to: email,
    //     subject: `Adoption Request Received for ${pet.name}`,
    //     text: `Thank you for submitting an adoption request for ${pet.name}. We will review your application and contact you soon.`
    //   });
    //
    //   await sendEmail({
    //     to: process.env.ADMIN_EMAIL,
    //     subject: `New Adoption Request for ${pet.name}`,
    //     text: `A new adoption request has been submitted for ${pet.name} by ${fullName}. Please review it in the admin dashboard.`
    //   });
    // } catch (emailError) {
    //   console.error("Error sending notification emails:", emailError);
    //   // Don't fail the request if email fails
    // }

    res.status(201).json({ 
      message: "Adoption request submitted successfully", 
      adoptionId: newAdoption._id 
    });
  } catch (error) {
    console.error("Error in submitAdoptionRequest:", error);
    res.status(500).json({ message: "Failed to submit adoption request", error: error.message });
  }
};

/**
 * Get all adoption requests with pagination
 * @route GET /api/adoptions/get-requests
 * @access Admin
 */
const getAdoptionRequests = async (req, res) => {
  try {
    // Extract pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    // Extract filter parameters
    const status = req.query.status;
    const search = req.query.search;
    
    // Build filter object
    const filter = {};
    if (status && ["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } }
      ];
    }
    
    // Get total count for pagination
    const total = await Adoption.countDocuments(filter);
    
    // Fetch adoptions with filters, pagination, and sorting
    const adoptions = await Adoption.find(filter)
      .populate('petId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.status(200).json(adoptions);
  } catch (error) {
    console.error("Error in getAdoptionRequests:", error);
    res.status(500).json({ message: "Error fetching adoption requests", error: error.message });
  }
};

/**
 * Get a specific adoption request by ID
 * @route GET /api/adoptions/get-request/:id
 * @access Admin
 */
const getAdoptionById = async (req, res) => {
  try {
    const adoption = await Adoption.findById(req.params.id).populate('petId');
    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" });
    }
    res.status(200).json(adoption);
  } catch (error) {
    console.error("Error in getAdoptionById:", error);
    res.status(500).json({ message: "Error fetching adoption details", error: error.message });
  }
};

/**
 * Update adoption request status
 * @route PUT /api/adoptions/update-status/:id
 * @access Admin
 */
const updateAdoptionStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminNotes } = req.body;

    // Validate status
    if (!["pending", "approved", "rejected", "withdrawn"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const adoption = await Adoption.findByIdAndUpdate(
      id,
      { 
        status, 
        adminNotes: adminNotes || "",
        updatedAt: Date.now() 
      },
      { new: true }
    ).populate('petId');

    if (!adoption) {
      return res.status(404).json({ message: "Adoption request not found" });
    }

    // If the pet was adopted (status approved), update the pet status
    if (status === "approved") {
      try {
        await Pet.findByIdAndUpdate(adoption.petId._id, { 
          adoptionStatus: "adopted",
          adoptedBy: adoption._id
        });
      } catch (petUpdateError) {
        console.error("Error updating pet adoption status:", petUpdateError);
        // Continue with the response even if pet update fails
      }
    }

    // Optional: Send email notifications based on status change
    // if (status === "approved" || status === "rejected") {
    //   try {
    //     const pet = adoption.petId;
    //     await sendEmail({
    //       to: adoption.email,
    //       subject: `Update on your adoption request for ${pet.name}`,
    //       text: status === "approved" 
    //         ? `Great news! Your adoption request for ${pet.name} has been approved. We'll contact you shortly to arrange the next steps.`
    //         : `Thank you for your interest in adopting ${pet.name}. After careful consideration, we regret to inform you that your adoption request has not been approved at this time.`
    //     });
    //   } catch (emailError) {
    //     console.error("Error sending status update email:", emailError);
    //   }
    // }

    res.status(200).json({ 
      message: `Adoption request ${status} successfully`, 
      adoption 
    });
  } catch (error) {
    console.error("Error in updateAdoptionStatus:", error);
    res.status(500).json({ message: "Failed to update adoption status", error: error.message });
  }
};

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
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Transform to a more usable format
    const formattedStats = {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      withdrawn: 0
    };
    
    stats.forEach(item => {
      formattedStats[item._id] = item.count;
      formattedStats.total += item.count;
    });
    
    res.status(200).json(formattedStats);
  } catch (error) {
    console.error("Error in getAdoptionStats:", error);
    res.status(500).json({ message: "Error fetching adoption statistics", error: error.message });
  }
};

export { 
  submitAdoptionRequest, 
  getAdoptionRequests, 
  getAdoptionById, 
  updateAdoptionStatus,
  getAdoptionStats
};