import Subscriber from '../models/Subscriber.js';
import { sendEmail } from '../utils/emailService.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // DB-ல் ஏற்கனவே உள்ளதா எனக் சோதிப்பது
    const existing = await Subscriber.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already subscribed!' });
    }

    await Subscriber.create({ email });

    // Welcome Email sending via Nodemailer
    await sendEmail({
      to: email,
      subject: 'Welcome to Jothi Classical Dancing Academy Newsletter',
      html: `<h3>Namaste!</h3><p>Thank you for subscribing to our newsletter updates.</p>`
    });

    res.status(201).json({ success: true, message: 'Subscribed successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};