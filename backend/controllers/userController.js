const User = require('../models/User');
const Review = require('../models/Review');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });
};

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, bio } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) { res.status(400); throw new Error('User already exists'); }
    const user = await User.create({ name, email, password, bio });
    if (user) { res.status(201).json({ _id: user._id, name: user.name, email: user.email, bio: user.bio, role: user.role }); }
    else { res.status(400); throw new Error('Invalid user data'); }
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user && (await user.matchPassword(password))) {
         const token = generateToken(user._id);
         res.json({ token: token, user: { _id: user._id, name: user.name, email: user.email, bio: user.bio, role: user.role } });
    } else { res.status(401); throw new Error('Invalid email or password'); }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404); throw new Error('User not found');
  }

  if (req.user._id.toString() !== user._id.toString()) {
      res.status(401);
      throw new Error('You can only update your own profile');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    bio: updatedUser.bio,
    role: updatedUser.role,
  });
});

const getUserReviews = asyncHandler(async (req, res) => {
    const userId = req.params.userId;

    const userExists = await User.findById(userId);
    if (!userExists) {
        res.status(404);
        throw new Error('User not found');
    }

    const reviews = await Review.find({ user: userId })
        .populate('book', 'title coverImageUrl')
        .sort({ createdAt: -1 });

    res.json(reviews);
});


const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).select('-password');
    res.json(users);
});

const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
        if (user.role === 'admin') { res.status(400); throw new Error('Cannot delete admin user'); }
        await user.remove();
        res.json({ message: 'User removed' });
    } else { res.status(404); throw new Error('User not found'); }
});

module.exports = {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUserReviews,
  getUsers,
  deleteUser
};
