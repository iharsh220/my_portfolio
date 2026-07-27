const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

function sanitize(str) {
  return String(str).replace(/[<>]/g, '').trim().slice(0, 500);
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.zoho.in',
  port: parseInt(process.env.SMTP_PORT || '465'),
  secure: true,
  auth: {
    user: process.env.SMTP_USER || 'iharsh220@zohomail.in',
    pass: process.env.SMTP_PASS || '',
  },
});

// POST /api/contact
router.post('/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: 'Invalid email address.' });
  }

  const cleanName = sanitize(name);
  const cleanEmail = sanitize(email);
  const cleanMessage = sanitize(message);

  try {
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.SMTP_USER || 'iharsh220@zohomail.in'}>`,
      to: 'iharsh220@zohomail.in',
      replyTo: cleanEmail,
      subject: `New message from ${cleanName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${cleanName}</p>
        <p><strong>Email:</strong> <a href="mailto:${cleanEmail}">${cleanEmail}</a></p>
        <p><strong>Message:</strong></p>
        <p>${cleanMessage.replace(/\n/g, '<br>')}</p>
      `,
    });
    res.json({ success: true, message: 'Message received! I will get back to you soon.' });
  } catch (err) {
    console.error('Mail error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
