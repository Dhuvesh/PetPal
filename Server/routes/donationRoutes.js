// routes/donationRoutes.js
import express from 'express';
import {
  createPaymentIntent,
  confirmDonation,
  createSubscription,
  getDonationById,
  getPublishableKey,
  resendDonationReceipt,
  getAllDonations  // Import the new controller function
} from '../controllers/donationController.js';

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameter routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-donation', confirmDonation);
router.post('/create-subscription', createSubscription);
router.get('/config', getPublishableKey);
router.get('/', getAllDonations); // Add the route to get all donations

// Parameter routes should come LAST
router.post('/:id/resend-receipt', resendDonationReceipt);
router.get('/:id', getDonationById);

export default router;