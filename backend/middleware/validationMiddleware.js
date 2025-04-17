const { body, validationResult, query, param } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({ field: err.param || err.path, message: err.msg }));
    return res.status(400).json({ errors: formattedErrors });
  }
  next();
};

const validateBookCreation = [
  body('title').notEmpty().withMessage('Title is required').trim(),
  body('author').notEmpty().withMessage('Author is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim(),
  body('coverImageUrl').optional().isURL().withMessage('Cover image must be a valid URL').trim(),
  body('genre').optional().trim(),
  body('isbn').optional().trim(),
  body('publisher').optional().trim(),
  body('publicationDate').optional().isISO8601().toDate().withMessage('Invalid publication date format'),
  handleValidationErrors
];

const validateReviewCreation = [
  body('bookId').notEmpty().isMongoId().withMessage('Valid Book ID is required in request body'),
  body('rating')
    .notEmpty().withMessage('Rating is required')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5'),
  body('comment').notEmpty().withMessage('Comment is required').trim(),
  handleValidationErrors
];

const validateUserUpdate = [
  param('id').isMongoId().withMessage('Invalid user ID format in URL'),
  body('name').optional().notEmpty().withMessage('Name cannot be empty').trim(),
  body('email')
    .optional()
    .isEmail().withMessage('Invalid email format')
    .normalizeEmail(),
  body('bio').optional().trim(),
  handleValidationErrors
];

const validateGetReviewsQuery = [
    query('bookId').isMongoId().withMessage('Valid book ID query parameter is required'),
    handleValidationErrors
];

const validateIdParam = [
    param('id').isMongoId().withMessage('Invalid resource ID format in URL'),
    handleValidationErrors
];

const validateUserIdParam = [
    param('userId').isMongoId().withMessage('Invalid user ID format in URL'),
    handleValidationErrors
];

module.exports = {
  validateBookCreation,
  validateReviewCreation,
  validateUserUpdate,
  validateGetReviewsQuery,
  validateIdParam,
  validateUserIdParam,
};
