const Comment = require('../models/Comment');
const Post = require('../models/Post');

// @desc    Add a comment to a post
// @route   POST /api/posts/:id/comments
// @access  Private
const addComment = async (req, res) => {
    const { content } = req.body;
    const postId = req.params.id;

    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const comment = await Comment.create({
            user: req.user._id,
            post: postId,
            content,
        });

        // Add comment to post's comments array
        post.comments.push(comment._id);
        await post.save();

        const populatedComment = await Comment.findById(comment._id).populate(
            'user',
            'username avatar'
        );

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a post
// @route   GET /api/posts/:id/comments
// @access  Public
const getComments = async (req, res) => {
    const postId = req.params.id;

    try {
        const comments = await Comment.find({ post: postId })
            .sort({ createdAt: -1 })
            .populate('user', 'username avatar');

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Check user (Owner of comment OR Owner of post can delete?)
        // For now, only owner of comment.
        if (comment.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Remove from Post's comments array
        await Post.findByIdAndUpdate(comment.post, {
            $pull: { comments: comment._id },
        });

        await comment.deleteOne();

        res.json({ message: 'Comment removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment,
};
