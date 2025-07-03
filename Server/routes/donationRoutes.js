// routes/donationRoutes.js
import express from 'express';
import {
  createPaymentIntent,
  confirmDonation,
  createSubscription,
  getDonationById,
  getPublishableKey,
  resendDonationReceipt,
  getAllDonations,
  getDonationStats  
} from '../controllers/donationController.js';

const router = express.Router();

// IMPORTANT: Specific routes must come BEFORE parameter routes
router.post('/create-payment-intent', createPaymentIntent);
router.post('/confirm-donation', confirmDonation);
router.post('/create-subscription', createSubscription);
router.get('/config', getPublishableKey);
router.get('/stats', getDonationStats); // Add stats route BEFORE parameter routes
router.get('/', getAllDonations);

// Parameter routes should come LAST
router.post('/:id/resend-receipt', resendDonationReceipt);
router.get('/:id', getDonationById);

export default router;