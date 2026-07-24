const express = require('express');
const router = express.Router();

// Input sanitizer (simple)
function sanitize(str) {
  return String(str).replace(/[<>]/g, '').trim().slice(0, 500);
}

// POST /api/contact
router.post('/contact', (req, res) => {
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

  // Log to console (replace with nodemailer / DB in production)
  console.log('📩 Contact Form Submission:', { cleanName, cleanEmail, cleanMessage });

  res.json({ success: true, message: 'Message received! I will get back to you soon.' });
});

// GET /api/health
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

module.exports = router;
