const express = require('express');
const router = express.Router();
const { createMenuItem, getMenuByRestaurant } = require('../controllers/menuController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/', protect, admin, createMenuItem); // create a menu item by admin only
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

module.exports = router;