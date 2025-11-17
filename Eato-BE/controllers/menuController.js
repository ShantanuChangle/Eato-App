const asyncHandler = require('express-async-handler');
const MenuItem = require('../models/menuItemModel');

const createMenuItem = asyncHandler(async (req, res) => {
  const { restaurant, name, description, price, isVeg } = req.body;
  if (!restaurant || !name || !price) {
    res.status(400);
    throw new Error('Missing required fields');
  }
  const menuItem = await MenuItem.create({ restaurant, name, description, price, isVeg });
  res.status(201).json(menuItem);
});

const getMenuByRestaurant = asyncHandler(async (req, res) => {
  const items = await MenuItem.find({ restaurant: req.params.restaurantId });
  res.json(items);
});

module.exports = { createMenuItem, getMenuByRestaurant };