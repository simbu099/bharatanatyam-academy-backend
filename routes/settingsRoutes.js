import express from 'express';
import { getActiveTheme, updateActiveTheme, updateMaintenanceMode } from '../controllers/settingsController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/theme')
  .get(getActiveTheme)
  .put(protect, adminOnly, updateActiveTheme);

router.put('/maintenance', protect, adminOnly, updateMaintenanceMode);

export default router;
