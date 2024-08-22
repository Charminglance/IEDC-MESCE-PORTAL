var express = require('express');
var path = require('path');
var indexRouter = require('./routes/index');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Define routes
app.use('/', indexRouter);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).send('Sorry, can’t find that!');
});

// Error handler
app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server
app.listen(3000, function() {
  console.log('Server is running on port 3000');
});

module.exports = app;