const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, deleteOrder, confirmDelivery, getAvailableDeliveryOrders, getMyDeliveryOrders, acceptOrder } = require('../controllers/orderController');
const { protect, delivery } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getUserOrders);

// DELIVERY: see available orders to accept
router.get('/delivery/available', protect, delivery, getAvailableDeliveryOrders);

// DELIVERY: see orders assigned to them
router.get('/delivery/my', protect, delivery, getMyDeliveryOrders);

// DELIVERY: accept an order
router.post('/:id/accept', protect, delivery, acceptOrder);

// DELIVERY: confirm delivery via OTP
router.post('/:id/confirm-delivery', protect, delivery, confirmDelivery);

// USER: delete own order (optional, only if status still placed)
router.delete('/:id', protect, deleteOrder);

module.exports = router;