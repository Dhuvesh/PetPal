import express from 'express';
import {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact
} from '../controllers/contactController.js';

const router = express.Router();

// Create contact and get all contacts
router.route('/')
  .post(createContact)
  .get(getContacts);

// Get, update and delete single contact
router.route('/:id')
  .get(getContact)
  .put(updateContact)
  .delete(deleteContact);

export default router;