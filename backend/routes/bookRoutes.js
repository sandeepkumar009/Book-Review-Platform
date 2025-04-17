const express = require('express');
const {
    getBooks,
    getBookById,
    createBook,
    getGenres, 
    updateBook,
    deleteBook,
} = require('../controllers/bookController');
const { protect, authorize } = require('../middleware/authMiddleware'); 
const { validateBookCreation, validateIdParam } = require('../middleware/validationMiddleware'); 

const router = express.Router();

router.route('/genres')
    .get(getGenres); 

router.route('/')
    .get(getBooks)
    .post(protect, authorize('admin'), validateBookCreation, createBook);

router.route('/:id')
    .get(validateIdParam, getBookById); 

    module.exports = router;
