const express = require('express');
const router = express.Router();
const { addReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Only logged-in users can add reviews
router.post('/', protect, addReview);

module.exports = router;