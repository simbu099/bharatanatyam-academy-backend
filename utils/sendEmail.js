const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // gsilambarasan54@gmail.com
      pass: process.env.EMAIL_PASS, // Gmail App Password
    },
  });
};

// 1. Send Admin Email Notification
exports.sendAdminNotification = async (type, details) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Alagu Jothi Academy" <${process.env.EMAIL_USER}>`,
      to: 'gsilambarasan54@gmail.com',
      subject: `🚨 New ${type} Received - Alagu Jothi Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 2px solid #800020; border-radius: 8px;">
          <h2 style="color: #800020;">New ${type} Submission Received!</h2>
          <p><strong>Name:</strong> ${details.name || details.studentName}</p>
          <p><strong>Email:</strong> ${details.email}</p>
          <p><strong>Phone:</strong> ${details.phone || 'N/A'}</p>
          <p><strong>Details / Event:</strong> ${details.message || details.courseName || details.eventType || 'N/A'}</p>
          <p><strong>Date/Slot:</strong> ${details.preferredSlot || details.eventDate || 'N/A'}</p>
          <hr />
          <p style="font-size: 12px; color: #666;">Login to Admin Panel to manage this request.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Admin Email Alert sent for ${type}`);
  } catch (error) {
    console.error('❌ Email sending failed (Admin):', error.message);
  }
};

// 2. Send User Confirmation Email
exports.sendUserConfirmation = async (userEmail, type, userName) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Alagu Jothi Academy" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `✨ Confirmation: Request Received - Alagu Jothi Classical Dancing Academy`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #d4af37; border-radius: 8px;">
          <h2 style="color: #800020;">Namaste ${userName},</h2>
          <p>Thank you for reaching out to <strong>Alagu Jothi Classical Dancing Academy</strong>.</p>
          <p>We have successfully received your <strong>${type}</strong> request. Our team will review your application and contact you shortly.</p>
          <br/>
          <p>Warm Regards,</p>
          <p><strong>Guru & Team - Alagu Jothi Academy</strong></p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ User Confirmation Email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Email sending failed (User):', error.message);
  }
};