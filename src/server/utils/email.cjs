const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define the email options
  const mailOptions = {
    from: options.from || 'BlazeTrade <no-reply@blazetrade.com>',
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
