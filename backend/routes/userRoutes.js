const express = require('express');
const userCtrl = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
    validateUserUpdate,
    validateIdParam,
    validateUserIdParam
} = require('../middleware/validationMiddleware');
const router = express.Router();

router.post('/register', userCtrl.registerUser); 
router.post('/login', userCtrl.loginUser);       


router.route('/')
    .get(protect, authorize('admin'), userCtrl.getUsers); 


router.route('/:userId/reviews')
    .get(validateUserIdParam, userCtrl.getUserReviews); 

router.route('/:id')
    .get(validateIdParam, userCtrl.getUserProfile) 
    .put(protect, validateIdParam, validateUserUpdate, userCtrl.updateUserProfile) 
    .delete(protect, authorize('admin'), validateIdParam, userCtrl.deleteUser); 


module.exports = router;
