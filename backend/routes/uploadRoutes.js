const express = require('express');
const router = express.Router();
const upload = require('../config/cloudinary');

router.post('/', upload.single('image'), (req, res) => {
    res.send({
        message: 'Image uploaded successfully',
        imageUrl: req.file.path,
    });
});

module.exports = router;
