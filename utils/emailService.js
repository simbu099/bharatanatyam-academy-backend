const nodemailer = require('nodemailer');

const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }
  return null;
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();
  
  if (!transporter) {
    console.log(`\n======================================================`);
    console.log(`[MOCK EMAIL NOTIFICATION SYSTEM]`);
    console.log(`TO: ${to}`);
    console.log(`SUBJECT: ${subject}`);
    console.log(`BODY SUMMARY: ${text || 'HTML Email Content'}`);
    console.log(`======================================================\n`);
    return { success: true, mock: true };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Natya Bharati Academy" <no-reply@natyabharati.com>',
      to,
      subject,
      text,
      html,
    });
    console.log(`[Email Sent]: MessageID ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Send Error]: ${error.message}`);
    // Log fallback so application doesn't fail on SMTP transport issue
    return { success: false, error: error.message };
  }
};

const sendBookingConfirmation = async (application, course, slot) => {
  const subject = `Admission Application Received - Natya Bharati Bharatanatyam Academy`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FDFBF7; padding: 20px; color: #141414;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #6B0D17; color: #D4AF37; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Natya Bharati Academy</h1>
          <p style="margin: 5px 0 0 0; color: #FFFDD0; font-size: 14px;">Classical Bharatanatyam Excellence</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #6B0D17; margin-top: 0;">Namaste ${application.studentName},</h2>
          <p>Thank you for registering for admission at Natya Bharati Academy. We have successfully received your application!</p>
          <div style="background-color: #FAFAEF; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6B0D17;">Application Details</h3>
            <p><strong>Course:</strong> ${course ? course.title : 'Bharatanatyam Course'}</p>
            <p><strong>Batch / Slot:</strong> ${slot ? `${slot.days} (${slot.startTime} - ${slot.endTime})` : 'Assigned Batch'}</p>
            <p><strong>Applicant Name:</strong> ${application.studentName}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Status:</strong> Under Review (Pending Guru Approval)</p>
          </div>
          <p>Our academic administration will verify your schedule and contact you shortly with fee details and onboarding orientation.</p>
          <p style="margin-top: 30px;">Warm regards,<br/><strong>Guru & Academic Team</strong><br/>Natya Bharati Bharatanatyam Academy</p>
        </div>
      </div>
    </div>
  `;
  return sendEmail({
    to: application.email,
    subject,
    html,
    text: `Namaste ${application.studentName}, your application for ${course ? course.title : 'Bharatanatyam Course'} has been received!`,
  });
};

const sendPerformanceNotification = async (request) => {
  const subject = `NEW PERFORMANCE INQUIRY: ${request.eventType} by ${request.organizerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FDFBF7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #6B0D17; border-radius: 8px; padding: 20px;">
        <h2 style="color: #6B0D17;">🎭 New Performance Request Inward</h2>
        <p><strong>Organizer Name:</strong> ${request.organizerName}</p>
        <p><strong>Organization:</strong> ${request.organization}</p>
        <p><strong>Event Type:</strong> ${request.eventType}</p>
        <p><strong>Event Date:</strong> ${new Date(request.eventDate).toDateString()}</p>
        <p><strong>Venue & City:</strong> ${request.venue}, ${request.city}</p>
        <p><strong>Troupe Format:</strong> ${request.troupeSize}</p>
        <p><strong>Budget Tier:</strong> ${request.estimatedBudget}</p>
        <p><strong>Contact Email:</strong> ${request.email}</p>
        <p><strong>Contact Phone:</strong> ${request.phone}</p>
        <p><strong>Special Requirements:</strong> ${request.specialRequests || 'None'}</p>
      </div>
    </div>
  `;
  return sendEmail({
    to: process.env.SMTP_USER || 'admin@natyabharati.com',
    subject,
    html,
    text: `New Performance Inquiry from ${request.organizerName} for event on ${request.eventDate}`,
  });
};

module.exports = {
  sendEmail,
  sendBookingConfirmation,
  sendPerformanceNotification,
};
