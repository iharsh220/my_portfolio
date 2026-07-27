const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();

const indexHtmlPath = path.join(__dirname, '../views/index.html');

router.get('/', (req, res) => {
  let html = fs.readFileSync(indexHtmlPath, 'utf-8');
  const botUrl = process.env.BOT_URL || '';
  html = html.replace(/src=""/, botUrl ? `src="${botUrl}"` : 'src=""');
  res.setHeader('Content-Type', 'text/html');
  res.send(html);
});

router.get('/about', (req, res) => res.redirect('/#about'));
router.get('/skills', (req, res) => res.redirect('/#skills'));
router.get('/projects', (req, res) => res.redirect('/#projects'));
router.get('/experience', (req, res) => res.redirect('/#experience'));
router.get('/contact', (req, res) => res.redirect('/#contact'));

module.exports = router;
