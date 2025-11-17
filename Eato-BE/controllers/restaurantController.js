const asyncHandler = require('express-async-handler');
const Restaurant = require('../models/restaurantModel');
const MenuItem = require('../models/menuItemModel');

// Create restaurant (admin ideally)
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, address, cuisine } = req.body;
  const restaurant = await Restaurant.create({ name, address, cuisine });
  res.status(201).json(restaurant);
});

// Get all restaurants
const getRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({});
  res.json(restaurants);
});

// Get restaurant by id (and optionally its menu)
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }
  const menu = await MenuItem.find({ restaurant: restaurant._id });
  res.json({ restaurant, menu });
});

module.exports = { createRestaurant, getRestaurants, getRestaurantById };