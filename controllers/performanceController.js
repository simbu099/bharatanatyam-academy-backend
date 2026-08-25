import PerformanceRequest from '../models/PerformanceRequest.js';
import { sendPerformanceNotification } from '../utils/emailService.js';

// @desc    Submit a new performance request & send email
// @route   POST /api/performance
// @access  Public
export const createPerformanceRequest = async (req, res) => {
  try {
    const newRequest = await PerformanceRequest.create(req.body);

    // Send Email Notification
    try {
      await sendPerformanceNotification(newRequest);
    } catch (emailError) {
      console.error('Email failed, but request saved:', emailError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Performance request submitted successfully!',
      data: newRequest,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all performance requests
// @route   GET /api/performance
// @access  Private/Admin
export const getPerformanceRequests = async (req, res) => {
  try {
    const requests = await PerformanceRequest.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: requests.length, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete performance request
// @route   DELETE /api/performance/:id
// @access  Private/Admin
export const deletePerformanceRequest = async (req, res) => {
  try {
    const request = await PerformanceRequest.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }
    res.status(200).json({ success: true, message: 'Request deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};