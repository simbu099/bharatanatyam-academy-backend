const express = require('express');
const router = express.Router();
const {
  getGalleryItems,
  createGalleryItem,
  deleteGalleryItem,
} = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/').get(getGalleryItems).post(protect, adminOnly, createGalleryItem);
router.delete('/:id', protect, adminOnly, deleteGalleryItem);

module.exports = router;
