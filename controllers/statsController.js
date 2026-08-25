import Course from '../models/Course.js';
import Booking from '../models/Booking.js';
import PerformanceRequest from '../models/PerformanceRequest.js';
import Review from '../models/Review.js';

// @desc    Get dashboard statistics for admin
// @route   GET /api/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalPerformanceRequests = await PerformanceRequest.countDocuments();
    const totalReviews = await Review.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        courses: totalCourses,
        bookings: totalBookings,
        performanceRequests: totalPerformanceRequests,
        reviews: totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};