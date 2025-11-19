const express = require('express');
const router = express.Router();
const { createRestaurant, getRestaurants, getRestaurantById } = require('../controllers/restaurantController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/').get(getRestaurants).post(protect, admin, createRestaurant);
router.get('/:id', getRestaurantById);

module.exports = router;