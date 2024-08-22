const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/auth-tut')
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
  process.exit(1); // Exit process with failure
});

module.exports = mongoose;