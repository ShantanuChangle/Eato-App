const express = require('express');
const router = express.Router();
const { createMenuItem, getMenuByRestaurant } = require('../controllers/menuController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createMenuItem); // create a menu item
router.get('/restaurant/:restaurantId', getMenuByRestaurant);

module.exports = router;