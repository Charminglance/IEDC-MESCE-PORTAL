const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const db = require('./config/connection');
const session = require('express-session');
require('dotenv').config(); // Load environment variables

const app = express();

// Connect to the database using the environment variable
db.connectToDatabase(process.env.MONGO_URI); // Ensure this handles connection errors

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'iedcmesce', // Use an environment variable for the secret
  resave: false,
  saveUninitialized: true,
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Secure cookie in production
    maxAge: 3600000 // 1 hour session timeout in milliseconds
  },
}));


// Define routes
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use((req, res, next) => {
  res.status(404).send('Sorry, can’t find that!');
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
const PORT = process.env.PORT || 3000; // Use an environment variable for the port
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
