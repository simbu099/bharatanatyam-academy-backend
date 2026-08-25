import nodemailer from 'nodemailer';

export const createApplication = async (req, res) => {
  try {
    const { 
      studentName, 
      email, 
      phone, 
      courseId, 
      courseName, 
      selectedSlot, 
      age, 
      experience, 
      notes 
    } = req.body;

    // 1. Basic Validation
    if (!studentName || !email || !phone || !courseName) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, Phone, Course)',
      });
    }

    const applicationData = {
      studentName,
      email,
      phone,
      courseId,
      courseName,
      selectedSlot: selectedSlot || 'General Batch',
      age: age || 'N/A',
      experience: experience || '0',
      notes: notes || 'None',
    };

    // 2. Nodemailer Transporter Config
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 465,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 3. Email Templates
    // Mail 1: Student Confirmation Mail
    const studentMailOptions = {
      from: process.env.EMAIL_FROM || `"Jothi Academy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: '🎉 Application & Slot Booking Confirmed - Jothi Classical Dancing Academy',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #800000; margin-top: 0;">Dear ${studentName},</h2>
          <p>Thank you for registering with <b>Jothi Classical Dancing Academy</b>! Your slot booking application has been successfully received.</p>
          
          <div style="background: #fff8f8; padding: 15px; border-left: 4px solid #800000; margin: 20px 0; border-radius: 4px;">
            <h3 style="margin-top:0; color: #800000;">Booking Details:</h3>
            <p style="margin: 5px 0;"><b>Course:</b> ${courseName}</p>
            <p style="margin: 5px 0;"><b>Slot Timing:</b> ${applicationData.selectedSlot}</p>
            <p style="margin: 5px 0;"><b>Contact Phone:</b> ${phone}</p>
          </div>

          <p>Our team will review your application and contact you shortly with further orientation details.</p>
          <br/>
          <p style="margin-bottom: 0;">Warm Regards,<br/><b>Guru & Administration Team</b><br/>Jothi Classical Dancing Academy</p>
        </div>
      `,
    };

    // Mail 2: Admin Notification Mail
    const adminMailOptions = {
      from: process.env.EMAIL_FROM || `"Jothi Academy Alert" <${process.env.SMTP_USER}>`,
      to: process.env.SMTP_USER, // Receives on Admin Email (gsilambarasan54@gmail.com)
      subject: `🚨 NEW SLOT BOOKING: ${studentName} - ${courseName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; border: 1px solid #eee; border-radius: 8px;">
          <h2 style="color: #800000; margin-top: 0;">New Admission / Slot Booking Alert!</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
            <tr><td style="padding: 8px; border: 1px solid #ddd; width: 35%;"><b>Student Name:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${studentName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Email:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Phone:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${phone}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Course:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${courseName}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Slot Selected:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${applicationData.selectedSlot}</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Age / Prior Exp:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${applicationData.age} Yrs / ${applicationData.experience} Yrs Exp</td></tr>
            <tr><td style="padding: 8px; border: 1px solid #ddd;"><b>Special Notes:</b></td><td style="padding: 8px; border: 1px solid #ddd;">${applicationData.notes}</td></tr>
          </table>
        </div>
      `,
    };

    // 4. Send Emails Asynchronously in Parallel for Maximum Performance
    Promise.allSettled([
      transporter.sendMail(studentMailOptions),
      transporter.sendMail(adminMailOptions),
    ]).then((results) => {
      results.forEach((result, idx) => {
        if (result.status === 'rejected') {
          console.error(`Email ${idx === 0 ? 'Student' : 'Admin'} sending failed:`, result.reason);
        }
      });
    });

    // 5. Send Immediate Response back to Client
    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully and confirmation email sent!',
      data: applicationData,
    });

  } catch (error) {
    console.error('Create Application Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to submit application',
    });
  }
};