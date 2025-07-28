const nodemailer = require('nodemailer');

const sendResetEmail = async (toEmail, resetLink) => {
  try {
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
      subject: 'Password Reset Request',
      html: `
        <p>Hello,</p>
        <p>You requested to reset your password.</p>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link is valid for 30 minutes only.</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Reset email sent to:', toEmail);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

module.exports = sendResetEmail;
