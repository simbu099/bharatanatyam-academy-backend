const PerformanceRequest = require('../models/PerformanceRequest');
const { sendPerformanceNotification } = require('../utils/emailService');

// @desc    Submit a performance booking request (Organizers)
// @route   POST /api/performance-requests
// @access  Public
const createPerformanceRequest = async (req, res) => {
  try {
    const request = await PerformanceRequest.create(req.body);

    // Send email alert to admin/teacher
    sendPerformanceNotification(request);

    res.status(201).json({
      success: true,
      message: 'Your performance booking inquiry has been submitted! Our artistic team will contact you shortly.',
      data: request,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all performance requests (Admin)
// @route   GET /api/performance-requests
// @access  Private/Admin
const getPerformanceRequests = async (req, res) => {
  try {
    const requests = await PerformanceRequest.find().sort({ createdAt: -1 });
    res.json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update performance request status (Admin)
// @route   PATCH /api/performance-requests/:id/status
// @access  Private/Admin
const updatePerformanceRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const request = await PerformanceRequest.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!request) {
      return res.status(404).json({ success: false, message: 'Performance inquiry not found' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createPerformanceRequest,
  getPerformanceRequests,
  updatePerformanceRequestStatus,
};
