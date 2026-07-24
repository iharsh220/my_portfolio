const express = require('express');
const path = require('path');
const router = express.Router();

// Home / Portfolio
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/index.html'));
});

// Individual sections as routes (SPA-style with hash, but also direct links)
router.get('/about', (req, res) => res.redirect('/#about'));
router.get('/skills', (req, res) => res.redirect('/#skills'));
router.get('/projects', (req, res) => res.redirect('/#projects'));
router.get('/experience', (req, res) => res.redirect('/#experience'));
router.get('/contact', (req, res) => res.redirect('/#contact'));

module.exports = router;
