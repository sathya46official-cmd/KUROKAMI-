const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            bio: user.bio,
            avatar: user.avatar,
            favoriteAnime: user.favoriteAnime,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.username = req.body.username || user.username;
        user.email = req.body.email || user.email;
        user.bio = req.body.bio || user.bio;
        user.avatar = req.body.avatar || user.avatar;
        user.favoriteAnime = req.body.favoriteAnime || user.favoriteAnime;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            bio: updatedUser.bio,
            avatar: updatedUser.avatar,
            favoriteAnime: updatedUser.favoriteAnime,
            isAdmin: updatedUser.isAdmin,
            token: req.headers.authorization.split(' ')[1], // Return same token
        });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

module.exports = { getUserProfile, updateUserProfile };
