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

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  const initials = cleanName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);

  const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Portfolio Message</title>
</head>
<body style="margin:0;padding:0;background:#0a0a10;font-family:'Segoe UI',Arial,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a10;padding:40px 16px;">
  <tr><td align="center">

    <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

      <!-- HEADER -->
      <tr>
        <td style="background:linear-gradient(135deg,#6c7fff,#a855f7);border-radius:20px 20px 0 0;padding:40px 40px 32px;text-align:center;">
          <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;width:56px;height:56px;line-height:56px;font-size:22px;font-weight:800;color:#fff;letter-spacing:-1px;margin-bottom:16px;">HG</div>
          <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px;">New Portfolio Message</h1>
          <p style="margin:8px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${dateStr} &nbsp;·&nbsp; ${timeStr}</p>
        </td>
      </tr>

      <!-- BODY -->
      <tr>
        <td style="background:#0f0f18;border-left:1px solid rgba(255,255,255,0.07);border-right:1px solid rgba(255,255,255,0.07);padding:36px 40px;">

          <!-- Sender card -->
          <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(108,127,255,0.08);border:1px solid rgba(108,127,255,0.2);border-radius:14px;margin-bottom:28px;">
            <tr>
              <td style="padding:24px;">
                <table cellpadding="0" cellspacing="0">
                  <tr>
                    <td style="vertical-align:middle;">
                      <div style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#6c7fff,#a855f7);display:inline-flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;text-align:center;line-height:48px;">${initials}</div>
                    </td>
                    <td style="padding-left:16px;vertical-align:middle;">
                      <p style="margin:0;font-size:16px;font-weight:700;color:#f0f0f5;">${cleanName}</p>
                      <a href="mailto:${cleanEmail}" style="color:#6c7fff;font-size:13px;text-decoration:none;">${cleanEmail}</a>
                    </td>
                    <td align="right" style="vertical-align:middle;">
                      <span style="background:rgba(74,222,128,0.12);border:1px solid rgba(74,222,128,0.3);color:#4ade80;border-radius:100px;padding:4px 14px;font-size:11px;font-weight:600;">● New Message</span>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>

          <!-- Meta row -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
            <tr>
              <td width="50%" style="padding-right:8px;">
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6c7fff;">From</p>
                  <p style="margin:0;font-size:13px;color:#f0f0f5;font-weight:500;">${cleanName}</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#8888aa;">${cleanEmail}</p>
                </div>
              </td>
              <td width="50%" style="padding-left:8px;">
                <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:16px 20px;">
                  <p style="margin:0 0 4px;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6c7fff;">To</p>
                  <p style="margin:0;font-size:13px;color:#f0f0f5;font-weight:500;">Harsh Gohil</p>
                  <p style="margin:2px 0 0;font-size:12px;color:#8888aa;">iharsh220@zohomail.in</p>
                </div>
              </td>
            </tr>
          </table>

          <!-- Message -->
          <p style="margin:0 0 12px;font-size:10px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#6c7fff;">Message</p>
          <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-left:3px solid #6c7fff;border-radius:0 12px 12px 0;padding:24px;margin-bottom:32px;">
            <p style="margin:0;font-size:15px;color:#d0d0e0;line-height:1.8;">${cleanMessage.replace(/\n/g, '<br>')}</p>
          </div>

          <!-- CTA -->
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td align="center">
                <a href="mailto:${cleanEmail}?subject=Re: Your message to Harsh Gohil" style="display:inline-block;background:linear-gradient(135deg,#6c7fff,#a855f7);color:#fff;text-decoration:none;font-size:14px;font-weight:600;padding:14px 36px;border-radius:100px;letter-spacing:0.01em;">↩ Reply to ${cleanName}</a>
              </td>
            </tr>
          </table>

        </td>
      </tr>

      <!-- FOOTER -->
      <tr>
        <td style="background:#080810;border:1px solid rgba(255,255,255,0.07);border-top:none;border-radius:0 0 20px 20px;padding:24px 40px;text-align:center;">
          <p style="margin:0 0 6px;font-size:12px;color:#555570;">This message was sent via the contact form on</p>
          <p style="margin:0;font-size:12px;"><a href="https://harshgohil.dev" style="color:#6c7fff;text-decoration:none;font-weight:600;">harshgohil.dev</a></p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>

</body>
</html>`;

  try {
    await transporter.sendMail({
      from: `"Harsh Gohil Portfolio" <${process.env.SMTP_USER || 'iharsh220@zohomail.in'}>`,
      to: 'iharsh220@zohomail.in',
      replyTo: `"${cleanName}" <${cleanEmail}>`,
      subject: `✉️ ${cleanName} sent you a message via Portfolio`,
      html: htmlTemplate,
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
