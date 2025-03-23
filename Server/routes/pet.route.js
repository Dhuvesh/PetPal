import express from "express"
import { GetPet, GetPetById, PostPet } from "../controllers/pet.controller.js"
import multer from "multer"
import path from "path"

const router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/")
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

// Handle multiple file uploads (up to 5 photos)
const multipleUpload = upload.fields([
  { name: "photo0", maxCount: 1 },
  { name: "photo1", maxCount: 1 },
  { name: "photo2", maxCount: 1 },
  { name: "photo3", maxCount: 1 },
  { name: "photo4", maxCount: 1 },
])

router.get("/get-pet", GetPet)
router.post("/post-pet", multipleUpload, PostPet)
router.get("/get-pet/:id", GetPetById)

export default router

