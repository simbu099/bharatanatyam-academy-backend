const Review = require('../models/Review');

// @desc    Get all approved reviews (or all for admin)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isApproved: true };
    const reviews = await Review.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit a new review
// @route   POST /api/reviews
// @access  Public
const createReview = async (req, res) => {
  try {
    const review = await Review.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for your testimonial! It is pending admin approval.',
      data: review,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Approve/Reject review (Admin)
// @route   PATCH /api/reviews/:id/approve
// @access  Private/Admin
const toggleApproveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    review.isApproved = !review.isApproved;
    await review.save();
    res.json({ success: true, data: review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete review (Admin)
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    await review.deleteOne();
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getReviews,
  createReview,
  toggleApproveReview,
  deleteReview,
};
