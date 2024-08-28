const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Member = require('../models/member'); // Import the Member model
const Admin = require('../models/admin');
const { doregister, moveDataToMembers, createAdminAccounts } = require('../helpers/registrationHelpers');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Function to send email
const sendEmail = async (to, subject, html) => {
  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html, // Use HTML content instead of plain text
    });
    console.log('Email sent successfully!');
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Re-throw the error to be caught by the route handler
  }
};

// Render the registration page
router.get('/', (req, res) => {
  res.render('register', { title: 'IEDC Registration' });
});

// Handle registration form submissions
router.post('/register', async (req, res) => {
  try {
    const success = await doregister(req.body);
    if (success) {
      res.send('Registration successful!');
    } else {
      res.send('Registration failed. User might already exist.');
    }
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).send('Internal server error.');
  }
});

// Render the admin login page
router.get('/admin-login', (req, res) => {
  res.render('admin-login', { title: 'Admin Login' });
});

// Handle admin login form submissions
router.post('/admin-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });

    if (admin) {
      const isMatch = await bcrypt.compare(password, admin.password);

      if (isMatch) {
        res.redirect('/admin-dashboard');
      } else {
        res.send('Invalid login credentials.');
      }
    } else {
      res.send('Invalid login credentials.');
    }
  } catch (error) {
    console.error('Error during admin login:', error);
    res.status(500).send('Internal server error.');
  }
});

// Render the admin dashboard
router.get('/admin-dashboard', async (req, res) => {
  try {
    const registrations = await User.find({ role: 'registration' });
    const message = req.query.message || '';
    res.render('admin-dashboard', { title: 'Admin Dashboard', registrations, message });
  } catch (error) {
    console.error('Error fetching data for dashboard:', error);
    res.status(500).send('Internal server error.');
  }
});

// Handle accept or reject actions for users
router.post('/admin-action', async (req, res) => {
  const { action, userId } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).send('User not found.');
    }

    if (action === 'accept') {
      // Generate registration number (You might need a different logic for this)
      const registrationNumber = user.email.split('@')[0]; // Example: Use the part before '@' in email as registration number
      const password = `${registrationNumber}#iedcmesce`;

      // Create a new member document
      const member = new Member({
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: 'member',
        fullName: user.fullName,
        batch: user.batch,
        department: user.department,
        address: user.address,
      });

      // Save the member document to the 'members' collection
      await member.save();

      // Remove the user from the 'users' collection
      await User.findByIdAndDelete(userId);

      // Send email with credentials
      await sendEmail(
        user.email,
        'Welcome to IEDC MES College of Engineering - Your Login Credentials',
        `
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <p>Dear <strong>${user.fullName}</strong>,</p>
      
          <p>We are thrilled to welcome you to the <strong>Innovation and Entrepreneurship Development Cell (IEDC)</strong> at MES College of Engineering! As part of our dynamic community, you now have access to a range of resources and opportunities designed to support your innovative endeavors.</p>
      
          <p>To get started, please find your login credentials below:</p>
      
          <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background-color: #f9f9f9;">
            <p><strong>Login ID:</strong> <span style="font-weight: bold;">${registrationNumber}</span></p>
            <p><strong>Password:</strong> <span style="font-weight: bold;">${password}</span></p>
          </div>
      
          <p>Log in to the IEDC portal at <a href="https://iedcmesce.org/" style="color: #1a73e8; text-decoration: none;">IEDC MESCE Portal</a> using these credentials. Once logged in, you'll be able to explore various features, including news, events, and collaboration opportunities.</p>
      
          <p><strong>Important:</strong></p>
          <ul>
            <li><strong>For security reasons, we strongly recommend changing your password upon first login.</strong></li>
            <li>If you encounter any issues or have questions, please contact our support team at <a href="mailto:support@iedcmesce.prg" style="color: #1a73e8; text-decoration: none;">support@iedcmesce.com</a>.</li>
          </ul>
      
          <p>We are excited to have you join us and look forward to your contributions to the IEDC community.</p>
      
          <p>Best regards,</p>
          <p><strong>SAFEEL</strong><br>
          Technical Associate, IEDC MES College of Engineering<br>
          Website: <a href="https://iedcmesce.org/" style="color: #1a73e8; text-decoration: none;">IEDC MESCE Website</a><br>
          Email: <a href="mailto:support@iedcmesce.org" style="color: #1a73e8; text-decoration: none;">support@iedcmesce.com</a></p>
      
          <p style="font-size: 0.9em; color: #666;">*This is an automated message. Please do not reply.*</p>
        </body>
        </html>
        `
      );

      // Redirect back to the admin dashboard with a success message
      res.redirect('/admin-dashboard?message=User accepted and email sent.');
    } else if (action === 'reject') {
      await User.findByIdAndDelete(userId);
      // Redirect back to the admin dashboard with a rejection message
      res.redirect('/admin-dashboard?message=User rejected and deleted.');
    } else {
      res.status(400).send('Invalid action.');
    }
  } catch (error) {
    console.error('Error handling admin action:', error);
    res.status(500).send('Internal server error.');
  }
});

// Optionally, create admin accounts
router.post('/create-admins', async (req, res) => {
  try {
    await createAdminAccounts();
    res.send('Admin accounts created.');
  } catch (error) {
    console.error('Error creating admin accounts:', error);
    res.status(500).send('Internal server error.');
  }
});

module.exports = router;
