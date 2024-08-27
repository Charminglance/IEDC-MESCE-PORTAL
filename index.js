const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const db = require('./config/connection');
require('dotenv').config(); // Load environment variables


const app = express();

// Connect to the database using the environment variable
db.connectToDatabase(process.env.MONGO_URI); // Update this if necessary

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

module.exports = app;
