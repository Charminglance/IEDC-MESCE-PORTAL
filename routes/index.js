var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'IEDC' });
});

// Route to render the login page
router.get('/login', function(req, res, next) {
  res.render('login', { title: 'LOGIN PAGE' });
});

// Handle login form submission
router.post('/login', function(req, res, next) {
  const { username, password } = req.body;

  // Log the credentials
  console.log(`Username: ${username}, Password: ${password}`);

  // Redirect to the home page or another page
  res.redirect('/');
});

router.post('/register', (req, res) => {
  const { fullName, email, password } = req.body;
  console.log(fullName);
  console.log(batch);
  console.log(email);
  console.log(password);
  
  // Logic to save the user in the database
  // Example: User.create({ username, email, password });
  console.log("registerd");
  
  res.send('User registered successfully');
});

module.exports = router;
