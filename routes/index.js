const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');  // Adjust the path to your User model
const registration = require("../helpers/registrationHelpers");

// Route to render the home page
router.get('/', function(req, res, next) {
    res.render('register', { title: 'IEDC' });
});

// Route to render the login page
router.get('/login', function(req, res, next) {
    res.render('login', { title: 'LOGIN PAGE' });
});

// Handle login form submission
router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;

    try {
        // Find the user by email
        const user = await User.findOne({ email });

        // Check if user exists and password matches
        if (user && await bcrypt.compare(password, user.password)) {
            if (user.role === 'admin') {
                // Redirect to admin page if user is an admin
                return res.redirect('/admin');
            } else {
                // Return a message if the user is not an admin
                return res.status(403).send('You are not an admin');
            }
        } else {
            return res.status(400).send('Invalid credentials');
        }
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).send('Login error');
    }
});

// Handle registration form submission
router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const result = await registration.doregister(data);

        if (result) {
            res.status(200).send('Account created successfully');
        } else {
            res.status(400).send('Account creation failed: Email or phone number already exists');
        }
    } catch (err) {
        console.error("Registration error:", err);
        res.status(500).send('Unable to create account');
    }
});

// Optional route to create admin accounts (secure this route appropriately)
router.post('/create-admins', async (req, res) => {
    try {
        await registration.createAdminAccounts();
        res.status(200).send('Admin accounts created successfully');
    } catch (err) {
        console.error("Admin creation error:", err);
        res.status(500).send('Unable to create admin accounts');
    }
});

module.exports = router;
