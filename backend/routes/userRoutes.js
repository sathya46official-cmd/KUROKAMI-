const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getUserById,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router
    .route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.route('/:id').get(getUserById);

module.exports = router;
