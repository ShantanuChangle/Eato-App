const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, deleteOrder, confirmDelivery } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getUserOrders);

// New: confirm delivery via OTP (user)
router.post('/:id/confirm-delivery', protect, confirmDelivery);

// NEW: delete an order (user must own it)
router.delete('/:id', protect, deleteOrder);

module.exports = router;