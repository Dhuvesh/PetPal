import express from "express";
import { GetVetById, GetVets } from "../controllers/vet.controller.js";

const router = express.Router();
router.get("/",GetVets);
router.get("/:placeId",GetVetById);

export default router
