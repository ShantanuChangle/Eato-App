const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel');

// place order
const placeOrder = asyncHandler(async (req, res) => {
  // req.user set by protect middleware
  const { restaurant, items } = req.body;
  if (!restaurant || !items || !items.length) {
    res.status(400);
    throw new Error('Order must have restaurant and items');
  }

  // compute total price and validate menu items
  let total = 0;
  const processedItems = [];
  for (const it of items) {
    const menu = await MenuItem.findById(it.menuItem);
    if (!menu) {
      res.status(400); throw new Error('Menu item not found');
    }
    const price = menu.price * (it.qty || 1);
    total += price;
    processedItems.push({ menuItem: menu._id, qty: it.qty || 1, price: menu.price });
  }

  const order = await Order.create({
    user: req.user._id,
    restaurant,
    items: processedItems,
    totalPrice: total,
  });

  res.status(201).json(order);
});

// get user orders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('restaurant').populate('items.menuItem');
  res.json(orders);
});

module.exports = { placeOrder, getUserOrders };