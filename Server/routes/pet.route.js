import express from "express"
import multer from "multer"
import { GetPet, GetPetById, PostPet } from "../controllers/pet.controller.js"

const router = express.Router()

// Memory storage (best for Cloudinary)
const storage = multer.memoryStorage()

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) cb(null, true)
    else cb(new Error("Only image files allowed"))
  }
})

// Allow up to 5 photos
const multipleUpload = upload.array("photos", 5)

router.get("/get-pet", GetPet)
router.post("/post-pet", multipleUpload, PostPet)
router.get("/get-pet/:id", GetPetById)

export default router
