import express from 'express';
import {
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
} from '../controllers/galleryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getGalleryImages)
  .post(protect, adminOnly, addGalleryImage);

router.route('/:id')
  .delete(protect, adminOnly, deleteGalleryImage);

export default router;