import Course from '../models/Course.js';
import Booking from '../models/Booking.js';
import Application from '../models/Application.js';
import PerformanceRequest from '../models/PerformanceRequest.js';
import Review from '../models/Review.js';

// @desc    Get dashboard statistics for admin
// @route   GET /api/stats
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalCourses,
      totalBookings,
      pendingBookings,
      totalApplications,
      pendingApplications,
      totalPerformanceRequests,
      pendingPerformanceRequests,
      totalReviews,
    ] = await Promise.all([
      Course.countDocuments(),
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'Pending' }),
      Application.countDocuments(),
      Application.countDocuments({ status: 'pending' }),
      PerformanceRequest.countDocuments(),
      PerformanceRequest.countDocuments({ status: 'pending' }),
      Review.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalCourses,
        totalBookings,
        pendingBookings,
        totalApplications,
        pendingApplications,
        totalPerformanceRequests,
        pendingPerformanceRequests,
        totalReviews,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};