const Review = require('../models/Review');
const Book = require('../models/Book');
const asyncHandler = require('express-async-handler');

const getReviewsByBookId = asyncHandler(async (req, res) => {
    const bookId = req.query.bookId;

    if (!bookId) {
        res.status(400);
        throw new Error('Book ID query parameter is required');
    }

    const reviews = await Review.find({ book: bookId })
        .populate('user', 'name')
        .sort({ createdAt: -1 });

    res.json(reviews);
});

const createReview = asyncHandler(async (req, res) => {
    const { rating, comment, bookId } = req.body;

    const book = await Book.findById(bookId);
    if (!book) {
        res.status(404);
        throw new Error('Book not found');
    }

    const alreadyReviewed = await Review.findOne({
        book: bookId,
        user: req.user._id,
    });

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('You have already reviewed this book');
    }

    const review = new Review({
        rating,
        comment,
        book: bookId,
        user: req.user._id,
    });

    const createdReview = await review.save();

    const populatedReview = await Review.findById(createdReview._id)
        .populate('user', 'name');

    res.status(201).json(populatedReview);
});

const updateReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString()) {
        res.status(401);
        throw new Error('User not authorized to update this review');
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    const updatedReview = await review.save();
    const populatedReview = await Review.findById(updatedReview._id)
        .populate('user', 'name');
    res.json(populatedReview);
});

const deleteReview = asyncHandler(async (req, res) => {
    const review = await Review.findById(req.params.id);

    if (!review) {
        res.status(404);
        throw new Error('Review not found');
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401);
        throw new Error('User not authorized to delete this review');
    }

    await review.remove();
    res.json({ message: 'Review removed successfully' });
});

module.exports = {
    getReviewsByBookId,
    createReview,
    updateReview,
    deleteReview,
};
