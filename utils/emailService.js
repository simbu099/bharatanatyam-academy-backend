import nodemailer from 'nodemailer';

const createTransporter = () => {
  // Gmail SMTP Transport
  return nodemailer.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 465,
    secure: true, // SSL/TLS
    auth: {
      user: process.env.SMTP_USER || process.env.EMAIL_USER,
      pass: process.env.SMTP_PASS || process.env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Jothi Classical Dancing Academy" <${process.env.SMTP_USER || process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`[Email Sent Successfully]: MessageID ${info.messageId} to ${to}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`[Email Send Error]: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// 1. Admission / Slot Booking Email Trigger
export const sendBookingConfirmation = async (application, course, slot) => {
  const subject = `Admission Application Received - Jothi Classical Dancing Academy`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FDFBF7; padding: 20px; color: #141414;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #D4AF37; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #6B0D17; color: #D4AF37; padding: 24px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">Jothi's Classical Dancing Academy</h1>
          <p style="margin: 5px 0 0 0; color: #FFFDD0; font-size: 14px;">Classical Bharatanatyam Excellence</p>
        </div>
        <div style="padding: 24px;">
          <h2 style="color: #6B0D17; margin-top: 0;">Namaste ${application.studentName},</h2>
          <p>Thank you for registering for admission at Jothi's Classical Dancing Academy. We have successfully received your application!</p>
          <div style="background-color: #FAFAEF; border-left: 4px solid #D4AF37; padding: 15px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #6B0D17;">Application Details</h3>
            <p><strong>Course:</strong> ${course ? (course.title || course.name) : (application.courseName || 'Bharatanatyam Course')}</p>
            <p><strong>Batch / Slot:</strong> ${slot ? `${slot.days} (${slot.startTime} - ${slot.endTime})` : (application.selectedSlot || 'Assigned Batch')}</p>
            <p><strong>Applicant Name:</strong> ${application.studentName}</p>
            <p><strong>Phone:</strong> ${application.phone}</p>
            <p><strong>Status:</strong> Under Review (Pending Guru Approval)</p>
          </div>
          <p>Our academic administration will verify your schedule and contact you shortly with fee details and onboarding orientation.</p>
          <p style="margin-top: 30px;">Warm regards,<br/><strong>Guru & Academic Team</strong><br/>Jothi's Classical Dancing Academy</p>
        </div>
      </div>
    </div>
  `;

  // Student Confirmation Mail & Admin Notification Mail executed concurrently
  const adminSubject = `🚨 NEW SLOT ADMISSION: ${application.studentName}`;
  const adminHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h2>New Student Application Received</h2>
      <p><strong>Student Name:</strong> ${application.studentName}</p>
      <p><strong>Email:</strong> ${application.email}</p>
      <p><strong>Phone:</strong> ${application.phone}</p>
      <p><strong>Course:</strong> ${application.courseName || 'Selected Course'}</p>
      <p><strong>Age:</strong> ${application.age}</p>
      <p><strong>Notes:</strong> ${application.notes || 'None'}</p>
    </div>
  `;

  await Promise.allSettled([
    sendEmail({
      to: application.email,
      subject,
      html,
      text: `Namaste ${application.studentName}, your application has been received!`,
    }),
    sendEmail({
      to: 'gsilambarasan54@gmail.com',
      subject: adminSubject,
      html: adminHtml,
    })
  ]);
};

// 2. Performance Inquiry Email Trigger
export const sendPerformanceNotification = async (request) => {
  const subject = `🎭 NEW PERFORMANCE INQUIRY: ${request.eventType} by ${request.organizerName}`;
  const html = `
    <div style="font-family: Arial, sans-serif; background-color: #FDFBF7; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #6B0D17; border-radius: 8px; padding: 20px;">
        <h2 style="color: #6B0D17;">🎭 New Performance Request Inward</h2>
        <p><strong>Organizer Name:</strong> ${request.organizerName}</p>
        <p><strong>Organization:</strong> ${request.organization}</p>
        <p><strong>Event Type:</strong> ${request.eventType}</p>
        <p><strong>Event Date:</strong> ${request.eventDate ? new Date(request.eventDate).toDateString() : 'N/A'}</p>
        <p><strong>Venue & City:</strong> ${request.venue}, ${request.city}</p>
        <p><strong>Troupe Format:</strong> ${request.troupeSize}</p>
        <p><strong>Budget Tier:</strong> ${request.estimatedBudget}</p>
        <p><strong>Contact Email:</strong> ${request.email}</p>
        <p><strong>Contact Phone:</strong> ${request.phone}</p>
        <p><strong>Special Requirements:</strong> ${request.specialRequests || 'None'}</p>
      </div>
    </div>
  `;

  const userHtml = `
    <div style="font-family: Arial, sans-serif; padding: 20px;">
      <h3>Namaste ${request.organizerName},</h3>
      <p>We have received your Performance Inquiry for <strong>${request.eventType}</strong>.</p>
      <p>Our troupe team will review the availability for ${request.eventDate} and contact you soon.</p>
      <p>Regards,<br/><strong>Jothi's Classical Dancing Academy</strong></p>
    </div>
  `;

  await Promise.allSettled([
    sendEmail({
      to: 'gsilambarasan54@gmail.com',
      subject,
      html,
      text: `New Performance Inquiry from ${request.organizerName}`,
    }),
    sendEmail({
      to: request.email,
      subject: `Performance Request Received - Jothi's Academy`,
      html: userHtml,
    })
  ]);
};