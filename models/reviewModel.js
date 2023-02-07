const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'Review can not be empty'],
  },

  rating: {
    type: Number,
    default: 0,
    min: [1, "Review can't be lower than one"],
    max: [5, "Review can't be higher than 5"],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  user: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user.'],
    },
  ],

  tour: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour.'],
    },
  ],
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
