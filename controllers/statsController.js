const Course = require('../models/Course');
const Application = require('../models/Application');
const PerformanceRequest = require('../models/PerformanceRequest');
const Review = require('../models/Review');
const Slot = require('../models/Slot');

// @desc    Get Admin Dashboard Summary Analytics
// @route   GET /api/stats/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalApplications = await Application.countDocuments();
    const pendingApplications = await Application.countDocuments({ status: 'pending' });
    const approvedApplications = await Application.countDocuments({ status: 'approved' });
    const totalPerformanceRequests = await PerformanceRequest.countDocuments();
    const pendingPerformanceRequests = await PerformanceRequest.countDocuments({ status: 'pending' });
    const totalReviews = await Review.countDocuments();
    const pendingReviews = await Review.countDocuments({ isApproved: false });

    // Recent applications
    const recentApplications = await Application.find()
      .populate('course', 'title')
      .populate('slot', 'days startTime endTime')
      .sort({ createdAt: -1 })
      .limit(5);

    // Recent performance requests
    const recentPerformanceRequests = await PerformanceRequest.find()
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalCourses,
        totalApplications,
        pendingApplications,
        approvedApplications,
        totalPerformanceRequests,
        pendingPerformanceRequests,
        totalReviews,
        pendingReviews,
        recentApplications,
        recentPerformanceRequests,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getDashboardStats };
