const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    deletePost,
    likePost,
} = require('../controllers/postController');
const { addComment, getComments } = require('../controllers/commentController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(getPosts).post(protect, createPost);
router.route('/:id').delete(protect, deletePost);
router.route('/:id/like').put(protect, likePost);
router.route('/:id/comments').get(getComments).post(protect, addComment);

module.exports = router;
