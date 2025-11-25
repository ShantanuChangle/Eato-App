const asyncHandler = require('express-async-handler');
const Review = require('../models/reviewModel');
const Order = require('../models/orderModel');
const Restaurant = require('../models/restaurantModel');

// helper: recalculate restaurant rating
const updateRestaurantRating = async (restaurantId) => {
  const stats = await Review.aggregate([
    { $match: { restaurant: restaurantId } },
    {
      $group: {
        _id: '$restaurant',
        numReviews: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      numReviews: stats[0].numReviews,
      averageRating: stats[0].avgRating,
    });
  } else {
    await Restaurant.findByIdAndUpdate(restaurantId, {
      numReviews: 0,
      averageRating: 0,
    });
  }
};

// POST /api/reviews
// user adds a review for a restaurant based on an order
const addReview = asyncHandler(async (req, res) => {
  const { restaurantId, orderId, rating, comment } = req.body;

  if (!restaurantId || !orderId || !rating) {
    res.status(400);
    throw new Error('restaurantId, orderId and rating are required');
  }

  // find order and verify ownership + status delivered
  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  // ensure this order belongs to the logged-in user
  if (order.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('You can only review your own orders');
  }

  // ensure this order is delivered and confirmed
  if (!order.isDeliveredConfirmed || order.status !== 'delivered') {
    res.status(400);
    throw new Error('You can only review delivered orders');
  }

  // ensure restaurant matches the order
  if (order.restaurant.toString() !== restaurantId) {
    res.status(400);
    throw new Error('Restaurant does not match this order');
  }

  // check if review already exists for this order + user
  const existing = await Review.findOne({
    user: req.user._id,
    order: orderId,
  });
  if (existing) {
    res.status(400);
    throw new Error('You have already reviewed this order');
  }

  // create review
  const review = await Review.create({
    user: req.user._id,
    restaurant: restaurantId,
    order: orderId,
    rating,
    comment,
  });

  // update restaurant rating
  await updateRestaurantRating(order.restaurant);

  res.status(201).json(review);
});

// GET /api/restaurants/:id/reviews
// get all reviews for a restaurant
const getRestaurantReviews = asyncHandler(async (req, res) => {
  const restaurantId = req.params.id;

  const reviews = await Review.find({ restaurant: restaurantId })
    .populate('user', 'name email')
    .sort({ createdAt: -1 });

  res.json(reviews);
});

module.exports = { addReview, getRestaurantReviews };
