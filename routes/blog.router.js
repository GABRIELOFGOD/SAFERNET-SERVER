const express = require('express');
const { blogPoster, getBlogs } = require('../controller/blog.controller');
const router = express.Router();
const multer = require('multer');
const { checkingForAdmin } = require('../middleware/adminchecker.middleware');
const { adminIdentifier } = require('../middleware/identifier.middleware');

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.route('/post', upload.single('image')).post(blogPoster);
router.get('/get', checkingForAdmin, adminIdentifier, getBlogs)

module.exports = router;