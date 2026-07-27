const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const indexHtmlPath = path.join(__dirname, '../views/index.html');

function getIndexHtml() {
  let html = fs.readFileSync(indexHtmlPath, 'utf-8');
  const botUrl = process.env.BOT_URL || '';
  if (botUrl) {
    const bubbleHtml = `
<div class="chat-bubble" id="chatBubble">
  <div class="chat-bubble-dot"></div>
</div>
<div class="chat-popup" id="chatPopup">
  <div class="chat-popup-header">
    <div class="chat-popup-info">
      <div class="chat-popup-avatar">HG</div>
      <div>
        <p class="chat-popup-name">Harsh's Assistant</p>
        <p class="chat-popup-status"><span class="chat-online-dot"></span>Online</p>
      </div>
    </div>
    <button class="chat-popup-close" id="chatClose">&times;</button>
  </div>
  <div class="chat-popup-body">
    <iframe src="${botUrl}" title="Chat with Harsh's Assistant" allow="microphone"></iframe>
  </div>
</div>`;
    html = html.replace('<!-- BOT_INJECT -->', bubbleHtml);
  }
  return html;
}

router.get('/', (req, res) => {
  const html = getIndexHtml();
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

router.get('/about', (req, res) => res.redirect('/#about'));
router.get('/skills', (req, res) => res.redirect('/#skills'));
router.get('/projects', (req, res) => res.redirect('/#projects'));
router.get('/experience', (req, res) => res.redirect('/#experience'));
router.get('/contact', (req, res) => res.redirect('/#contact'));

module.exports = router;
