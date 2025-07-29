const nodemailer = require('nodemailer');


require('dotenv').config();

const sendResetEmail = async (toEmail, resetLink) => {
  try {
 
    console.log('📤 Sending email from:', process.env.EMAIL_USER);
    console.log('📩 Sending to:', toEmail);

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: `"Password Reset" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: ' Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}" style="color:blue">${resetLink}</a>
        <p>This link is valid for <strong>30 minutes</strong>.</p>
        <br>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset email sent successfully to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error.message);
    throw error;
  }
};

module.exports = sendResetEmail;
