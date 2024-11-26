import express from 'express'
import { addPet, getPetById, getPets, nearbyVets } from '../controllers/pet.controller.js';
import multer from 'multer';


const router = express.Router();

const storage =multer.memoryStorage();

const upload = multer({storage:storage});

router.get('/pet-info', getPets);
router.get('/pet-info/:id', getPetById);
router.get('/nearby-vets', nearbyVets);
router.post('/add-pet',upload.array('photos', 5), addPet);


export default router
