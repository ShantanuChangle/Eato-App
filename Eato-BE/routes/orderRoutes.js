const express = require('express');
const router = express.Router();
const { placeOrder, getUserOrders, deleteOrder } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, placeOrder);
router.get('/myorders', protect, getUserOrders);


// NEW: delete an order (user must own it)
router.delete('/:id', protect, deleteOrder);

module.exports = router;