const express = require('express');
const router = express.Router();

// Pages
// home page
router.get('/', (req, res) => {
    res.render('layouts/home', { title: 'Home' });
});

// About page
router.get('/about', (req, res) => {
    res.render('layouts/about', { title: 'About', pageData: { /* Data for home page */ } });
});

// Contact us Page
router.get('/contact', (req, res) => {
    res.render('layouts/contact', { title: 'Contact Us' });
});

// Signup Page
router.get('/signup', (req, res) => {
    res.render('layouts/signup', { title: 'Sign up' });
});

// Add Item Page
router.get('/add-item', (req, res) => {
    res.render('layouts/add_item', { title: 'Add Item' });
});

// Admin Page
router.get('/dashboard', (req, res) => {
    res.render('layouts/admin_dashboard', { title: 'Add Item' });
});

  // Login Page
router.get('/login', (req, res) => {
    res.render('layouts/login', { title: 'Login' });
});
  

module.exports = router;
