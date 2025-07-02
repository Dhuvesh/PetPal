import express from 'express';
import { 
    checkAuth, 
    login, 
    logout, 
    signup, 
    ngoSignup, 
    updateProfile 
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Authentication routes
router.post('/signup', signup);              // Individual user signup
router.post('/ngo-signup', ngoSignup);       // NGO representative signup
router.post('/login', login);                // Universal login
router.post('/logout', logout);

// Protected routes
router.put('/update-profile', protectRoute, updateProfile);
router.get('/check', protectRoute, checkAuth);

export default router;