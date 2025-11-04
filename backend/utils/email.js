// utils/sendEmail.js
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // true for 465 (SSL), false for 587 (TLS)
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Utility function
const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: `"My App" <${process.env.SMTP_USER}>`, // sender address
      to,                                         // recipient
      subject,                                    // email subject
      html,                                       // email content (HTML)
    });

    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error; // rethrow if you want the caller to handle it
  }
};

// ✅ Export the function directly
module.exports = sendEmail;
