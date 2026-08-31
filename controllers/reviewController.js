import Review from '../models/Review.js';

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
export const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all reviews including unapproved ones, for moderation
// @route   GET /api/reviews/admin
// @access  Private/Admin
export const getAllReviewsForAdmin = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reviews.length, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or unapprove a review so it shows/hides publicly
// @route   PUT /api/reviews/:id/approve
// @access  Private/Admin
export const approveReview = async (req, res) => {
  try {
    // Body may specify { approved: false } to unapprove; default is approve.
    const approved = typeof req.body.approved === 'boolean' ? req.body.approved : true;
    const review = await Review.findByIdAndUpdate(
      req.params.id,
      { approved, isApproved: approved },
      { new: true }
    );
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }
    res.status(200).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      name: req.user.name || req.user.username || 'Anonymous Student',
      rating,
      comment,
      isApproved: false,
      approved: false,
    });

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: 'Review removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};