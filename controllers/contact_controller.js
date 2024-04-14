// controllers/contactController.js
const Contact = require("../models/contact_model");

const createContact = (req, res) => {
    const { fullname, email, message } = req.body;
    console.log("Req.body", req.body)

    // Basic validations
    if (!fullname || !email || !message) {
        return res.status(400).json({ error: true, message: 'All fields are required.' });
    }

    // Callback function to handle database operation result
    const callback = (error, newContact) => {
        if (error) {
            console.error('Server error during creation:', error);
            return res.status(500).json({ error: true, message: 'Server error during contact us creation. Please try again later.' });
        }
        console.log('New Contact us created successfully:', newContact);
        return res.status(200).json({ success: true, message: 'New Contact us created successfully.', contact: newContact });
    };

    // Call the model's create method and pass the callback
    Contact.create({ fullname, email, message }, callback);
};

const getAllContact = (req, res) => {
    // Callback function to handle database operation result
    const callback = (err, contacts) => {
        if (err) {
            console.error('Error while fetching contacts:', err);
            return res.status(500).json({ error: true, message: 'Server error while fetching contacts.' });
        }

        // Send the contacts as JSON response
        return res.status(200).json({ success: true, contacts });
    };

    // Call the model's getAll method and pass the callback
    Contact.getAll(callback);
};

module.exports = { createContact, getAllContact };