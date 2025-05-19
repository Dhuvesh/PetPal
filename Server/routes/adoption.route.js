import express from "express";
import {
  submitAdoptionRequest,
  getAdoptionRequests,
  getAdoptionById,
  updateAdoptionStatus,
  getAdoptionStats
} from "../controllers/adoption.controller.js";
// import { validateToken, isAdmin } from "../middleware/auth.middleware.js"; // Uncomment when auth is implemented

const router = express.Router();

/**
 * @route POST /api/adoptions/submit-request
 * @description Submit a new adoption request
 * @access Public
 */
router.post("/submit-request", submitAdoptionRequest);

/**
 * @route GET /api/adoptions/get-requests
 * @description Get all adoption requests (with optional filters)
 * @access Admin
 */
// router.get("/get-requests", validateToken, isAdmin, getAdoptionRequests); // With auth middleware
router.get("/get-requests", getAdoptionRequests); // Without auth middleware for now

/**
 * @route GET /api/adoptions/stats
 * @description Get adoption statistics for dashboard
 * @access Admin
 */
// router.get("/stats", validateToken, isAdmin, getAdoptionStats); // With auth middleware
router.get("/stats", getAdoptionStats); // Without auth middleware for now

/**
 * @route GET /api/adoptions/get-request/:id
 * @description Get specific adoption request by ID
 * @access Admin
 */
// router.get("/get-request/:id", validateToken, isAdmin, getAdoptionById); // With auth middleware
router.get("/get-request/:id", getAdoptionById); // Without auth middleware for now

/**
 * @route PUT /api/adoptions/update-status/:id
 * @description Update adoption request status (approve/reject)
 * @access Admin
 */
// router.put("/update-status/:id", validateToken, isAdmin, updateAdoptionStatus); // With auth middleware
router.put("/update-status/:id", updateAdoptionStatus); // Without auth middleware for now

export default router;