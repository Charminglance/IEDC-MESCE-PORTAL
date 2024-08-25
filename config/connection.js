const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/iedcmesce-portal';

async function connectToDatabase() {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected successfully to database');
  } catch (err) {
    console.error('Database connection error:', err);
    throw new Error('Unable to connect to database');
  }
}

module.exports = {
  connectToDatabase,
};
