const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const router = express.Router();

const indexHtmlPath = path.join(__dirname, '../views/index.html');
const publicDir = path.join(__dirname, '../public');

// Fingerprint CSS/JS so browsers always fetch the latest version after a deploy
function assetVersion() {
  const hash = crypto.createHash('md5');
  for (const f of ['css/style.css', 'js/main.js', 'js/demos.js']) {
    try { hash.update(fs.readFileSync(path.join(publicDir, f))); } catch (e) { /* missing file */ }
  }
  return hash.digest('hex').slice(0, 10);
}

function renderIndex() {
  const botUrl = (process.env.BOT_URL || '').replace(/"/g, '&quot;');
  return fs.readFileSync(indexHtmlPath, 'utf-8')
    .replace('__BOT_URL__', botUrl)
    .replace(/__ASSET_V__/g, assetVersion());
}

// Cache rendered page in production; re-render on every request in development
const isProd = process.env.NODE_ENV === 'production';
let cachedHtml = null;

router.get('/', (req, res) => {
  const html = isProd ? (cachedHtml ||= renderIndex()) : renderIndex();
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache');
  res.send(html);
});

router.get('/about', (req, res) => res.redirect('/#about'));
router.get('/skills', (req, res) => res.redirect('/#skills'));
router.get('/demos', (req, res) => res.redirect('/#demos'));
router.get('/projects', (req, res) => res.redirect('/#projects'));
router.get('/experience', (req, res) => res.redirect('/#experience'));
router.get('/contact', (req, res) => res.redirect('/#contact'));

module.exports = router;
