const express = require('express');
const authenticationController = require('../controllers/authenticationController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authenticationController.protect,
    authenticationController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
