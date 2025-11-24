const asyncHandler = require('express-async-handler');
const Order = require('../models/orderModel');
const MenuItem = require('../models/menuItemModel');
const { sendDeliveryOtpEmail } = require('../utils/emailService');

// helper to generate 6-digit OTP
const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// place order
const placeOrder = asyncHandler(async (req, res) => {

  const { restaurant, items } = req.body;

  if (!restaurant || !items || !items.length) {
    res.status(400);
    throw new Error('Order must have restaurant and items');
  }

  let total = 0;
  const processedItems = [];

  for (const it of items) {
    const menu = await MenuItem.findById(it.menuItem);
    if (!menu) {
      res.status(400);
      throw new Error('Menu item not found');
    }
    const qty = it.qty || 1;
    const price = menu.price * qty;
    total += price;
    processedItems.push({ menuItem: menu._id, qty, price: menu.price });
  }

  // Generate OTP + expiry
  const otp = generateOtp();
  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

  const order = await Order.create({
    user: req.user._id,
    restaurant,
    items: processedItems,
    totalPrice: total,
    status: 'placed',
    deliveryOtp: otp,
    deliveryOtpExpiresAt: expiresAt,
  });

  // Send OTP email
  if (req.user && req.user.email) {
    await sendDeliveryOtpEmail(req.user.email, otp, order._id.toString());
  } else {
    console.log('6) req.user.email NOT FOUND, skipping email send');
  }

  res.status(201).json(order);
});


// get user orders
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('restaurant').populate('items.menuItem');
  res.json(orders);
});

// Confirm delivery via OTP (done by delivery person)
const confirmDelivery = asyncHandler(async (req, res) => {
  const orderId = req.params.id;
  const { otp } = req.body;

  if (!otp) {
    res.status(400);
    throw new Error('OTP is required');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // ensure this order belongs to the current delivery person
  if (!order.deliveryPerson || order.deliveryPerson.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only confirm delivery for orders assigned to you');
  }

  if (!order.deliveryOtp || !order.deliveryOtpExpiresAt) {
    res.status(400);
    throw new Error('No active OTP for this order');
  }

  if (order.deliveryOtpExpiresAt < new Date()) {
    res.status(400);
    throw new Error('OTP has expired, please contact support');
  }

  if (order.deliveryOtp !== otp) {
    res.status(400);
    throw new Error('Invalid OTP');
  }

  // mark as delivered and confirmed
  order.status = 'delivered';
  order.isDeliveredConfirmed = true;
  order.deliveryOtp = undefined;
  order.deliveryOtpExpiresAt = undefined;

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});


// NEW: delete order for the logged-in user
// @desc    Delete an order
// @route   DELETE /api/orders/:id
// @access  Private (user can delete only own order)
const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // make sure this order belongs to the logged-in user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own orders');
  }

  await order.deleteOne();

  res.json({ message: 'Order removed' });
});

// Get orders available for delivery persons to accept
// Orders that are placed, not yet assigned to any delivery person
const getAvailableDeliveryOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    status: 'placed',
    deliveryPerson: null,
  })
    .populate('restaurant', 'name')
    .populate('user', 'name email');

  res.json(orders);
});

// Get orders assigned to current delivery person
const getMyDeliveryOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({
    deliveryPerson: req.user._id,
  })
    .populate('restaurant', 'name')
    .populate('user', 'name email');

  res.json(orders);
});

// Delivery person accepts an order
const acceptOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.id;

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // Order already taken by someone else?
  if (order.deliveryPerson) {
    res.status(400);
    throw new Error('Order already accepted by another delivery person');
  }

  // Only allow accepting if it's still placed
  if (order.status !== 'placed') {
    res.status(400);
    throw new Error('Order is not in a state to be accepted');
  }

  order.deliveryPerson = req.user._id;
  order.status = 'accepted';

  const updatedOrder = await order.save();

  res.json(updatedOrder);
});

module.exports = { placeOrder, getUserOrders, deleteOrder, confirmDelivery, getAvailableDeliveryOrders, getMyDeliveryOrders, acceptOrder };