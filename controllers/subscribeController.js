import Subscriber from '../models/Subscriber.js';
import { sendEmail } from '../utils/emailService.js';

// @desc    Subscribe an email to the newsletter
// @route   POST /api/subscribe
// @access  Public
export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;

    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'This email is already subscribed!' });
    }

    await Subscriber.create({ email });

    try {
      await sendEmail({
        to: email,
        subject: 'Welcome to Jothi Classical Dancing Academy Newsletter',
        html: `<h3>Namaste!</h3><p>Thank you for subscribing to our newsletter updates.</p>`,
      });
    } catch (mailError) {
      console.error('Welcome email failed, but subscription was saved:', mailError.message);
    }

    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all newsletter subscribers
// @route   GET /api/subscribe
// @access  Private/Admin
export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: subscribers.length, data: subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
