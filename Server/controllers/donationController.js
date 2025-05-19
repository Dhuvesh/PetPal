// controllers/donationController.js
import Stripe from 'stripe';
import Donation from '../models/Donation.js';
import { sendDonationReceipt } from '../utils/emailService.js';

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create payment intent for one-time donation
// @route   POST /api/donations/create-payment-intent
// @access  Public
const createPaymentIntent = async (req, res) => {
  try {
    const { amount, fundType, isMonthly, currency = 'inr' } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    // Convert amount to cents/paisa for Stripe
    const amountInSmallestUnit = Math.round(amount * 100);

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency,
      metadata: {
        fundType,
        isMonthly: String(isMonthly)
      }
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Confirm donation after successful payment
// @route   POST /api/donations/confirm-donation
// @access  Public
const confirmDonation = async (req, res) => {
  try {
    const { 
      paymentIntentId, 
      firstName, 
      lastName, 
      email, 
      message, 
      fundType 
    } = req.body;

    // Get payment intent from Stripe to confirm payment and get amount
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    
    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ message: 'Payment has not been completed' });
    }

    // Create donation record
    const donation = await Donation.create({
      paymentIntentId,
      firstName,
      lastName,
      email,
      amount: paymentIntent.amount / 100, // Convert back from paisa to rupees
      fundType,
      isMonthly: false,
      message
    });

    // Send donation receipt email
    try {
      await sendDonationReceipt(donation);
      console.log(`Donation receipt sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending donation receipt:', emailError);
      // We don't want to fail the whole request if just the email fails
      // Instead, log it and continue
    }

    res.status(201).json({
      success: true,
      donation,
      receiptSent: true
    });
  } catch (error) {
    console.error('Error confirming donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create subscription for monthly donations
// @route   POST /api/donations/create-subscription
// @access  Public
const createSubscription = async (req, res) => {
  try {
    const { 
      paymentMethodId, 
      amount, 
      firstName,
      lastName,
      email,
      fundType,
      message
    } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'Please provide a valid amount' });
    }

    // Convert amount to cents/paisa for Stripe
    const amountInSmallestUnit = Math.round(amount * 100);

    // Create customer
    const customer = await stripe.customers.create({
      payment_method: paymentMethodId,
      email,
      name: `${firstName} ${lastName}`,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [
        {
          price_data: {
            currency: 'inr',
            product_data: {
              name: `Monthly ${fundType} Fund Donation`,
            },
            unit_amount: amountInSmallestUnit,
            recurring: {
              interval: 'month',
            },
          },
        },
      ],
      payment_settings: {
        payment_method_types: ['card'],
        save_default_payment_method: 'on_subscription',
      },
      metadata: {
        fundType,
        firstName,
        lastName,
        email,
        amount: amount.toString(),
      },
      expand: ['latest_invoice.payment_intent']
    });

    // Create donation record for the initial payment
    const donation = await Donation.create({
      paymentIntentId: subscription.latest_invoice.payment_intent.id,
      firstName,
      lastName,
      email,
      amount,
      fundType,
      isMonthly: true,
      subscriptionId: subscription.id,
      message
    });

    // Send donation receipt email
    try {
      await sendDonationReceipt(donation);
      console.log(`Subscription donation receipt sent to ${email}`);
    } catch (emailError) {
      console.error('Error sending subscription donation receipt:', emailError);
      // Continue even if email sending fails
    }

    // Return the client secret to confirm payment on frontend
    res.status(200).json({
      subscriptionId: subscription.id,
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
      receiptSent: true
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get donation by ID
// @route   GET /api/donations/:id
// @access  Public
const getDonationById = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    res.status(200).json(donation);
  } catch (error) {
    console.error('Error getting donation:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get publishable key
// @route   GET /api/donations/config
// @access  Public
const getPublishableKey = async (req, res) => {
  res.status(200).json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
};

// @desc    Resend donation receipt email
// @route   POST /api/donations/:id/resend-receipt
// @access  Public
const resendDonationReceipt = async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return res.status(404).json({ message: 'Donation not found' });
    }
    
    // Send donation receipt email
    await sendDonationReceipt(donation);
    
    res.status(200).json({
      success: true,
      message: `Receipt resent to ${donation.email}`
    });
  } catch (error) {
    console.error('Error resending donation receipt:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllDonations = async (req, res) => {
  try {
    // You can add query parameters for filtering, sorting, or pagination
    // Example: const { page = 1, limit = 20, sort = '-createdAt' } = req.query;
    
    // Basic implementation: Get all donations sorted by creation date (newest first)
    const donations = await Donation.find()
      .sort({ createdAt: -1 })
      .limit(100); // Limiting to 100 records for performance, adjust as needed
    
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export {
  createPaymentIntent,
  confirmDonation,
  createSubscription,
  getDonationById,
  getPublishableKey,
  resendDonationReceipt,
   getAllDonations 
};