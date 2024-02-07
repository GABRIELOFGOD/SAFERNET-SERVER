const express = require('express');
const { blogPoster } = require('../controller/blog.controller');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.route('/post', upload.single('image')).post(blogPoster);

module.exports = router;