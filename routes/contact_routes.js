// routes/contactRouter.js
const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contact_controller');


// Route for handling form submissions
router.get('/', contactController.getAllContact);
router.post('/', contactController.createContact);

module.exports = router;
