import express from 'express';
import { getSiteContent, updateSiteContent } from '../controllers/contentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSiteContent)
  .put(protect, adminOnly, updateSiteContent);

export default router;
