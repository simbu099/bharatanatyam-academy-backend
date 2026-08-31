import express from 'express';
import { uploadImage, deleteImage } from '../controllers/uploadController.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Both admins and teachers may upload images (e.g. teachers updating
// their own profile photo); only admins may delete Cloudinary assets.
router.post('/', protect, requireRole('admin', 'teacher'), upload.single('image'), uploadImage);
router.delete('/', protect, requireRole('admin'), deleteImage);

export default router;
