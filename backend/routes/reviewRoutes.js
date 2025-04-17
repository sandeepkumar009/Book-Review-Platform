const express = require('express');
const {
    getReviewsByBookId,
    createReview,
    updateReview, // Import if implemented
    deleteReview, // Import if implemented
} = require('../controllers/reviewController');
const { protect, authorize } = require('../middleware/authMiddleware'); 
const { validateReviewCreation, validateGetReviewsQuery, validateIdParam } = require('../middleware/validationMiddleware'); 

const router = express.Router();

router.route('/')
    .get(validateGetReviewsQuery, getReviewsByBookId);

router.route('/')
    .post(protect, validateReviewCreation, createReview);

// Example routes for Update and Delete (Require login, owner or admin)
/*
router.route('/:id')
    // PUT /api/reviews/:id (Update a review)
    .put(protect, validateIdParam, updateReview)
    // DELETE /api/reviews/:id (Delete a review)
    .delete(protect, validateIdParam, deleteReview);
*/

module.exports = router;
