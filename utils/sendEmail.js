const nodemailer = require('nodemailer');

const sendResetEmail = async (toEmail, resetLink) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS, 
    },
  });

  const mailOptions = {
    from: `"Reset Support" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: 'Reset Your Password',
    html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendResetEmail;
