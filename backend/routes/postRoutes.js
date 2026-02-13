const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    deletePost,
    likePost,
} = require('../controllers/postController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);

module.exports = router;
