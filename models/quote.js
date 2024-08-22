const mongoose = require('mongoose');

const quoteSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Quote text is required'],
    minlength: [5, 'Quote text must be at least 5 characters long'],
  },
  author: {
    type: String,
    required: [true, 'Author name is required'],
    minlength: [3, 'Author name must be at least 3 characters long'],
  },
  tags: {
    type: [String],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

quoteSchema.index({ text: 'text', author: 'text' }); // Text index for search

quoteSchema.pre('save', function(next) {
  this.updatedAt = Date.now(); // Update the updatedAt field before saving
  next();
});

const Quote = mongoose.model('Quote', quoteSchema);

module.exports = Quote;
