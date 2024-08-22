var express = require('express');
var router = express.Router();

// Route to render the home page
router.get('/', function(req, res, next) {
  res.render('register', { title: 'IEDC' });
});

// Route to render the login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN PAGE' });
});

// Handle login form submission
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;
  

  // Log the credentials
  console.log(Username: ${username}, Password: ${password});

  // Redirect to the home page or another page
  res.redirect('/');
});

// Handle registration form submission
router.post('/register', (req, res) => {
  const { fullName, email, phoneNumber, batch, department, address } = req.body;

  // Log the data to the console
  console.log('Full Name:', fullName);
  console.log('Email:', email);
  console.log('Phone Number:', phoneNumber);
  console.log('Batch:', batch);
  console.log('Department:', department);
  console.log('Address:', address);

  // Logic to save the user in the database
  // Example: User.create({ fullName, email, phoneNumber, batch, department, address });

  console.log("User registered successfully");
  res.send('User registered successfully');
});

module.exports = router;