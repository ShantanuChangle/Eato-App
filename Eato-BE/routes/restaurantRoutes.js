const express = require('express');
const router = express.Router();
const { createRestaurant, getRestaurants, getRestaurantById } = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');
const { getRestaurantReviews } = require('../controllers/reviewController');


router.route('/').get(getRestaurants).post(protect, admin, createRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/reviews', getRestaurantReviews);

module.exports = router;