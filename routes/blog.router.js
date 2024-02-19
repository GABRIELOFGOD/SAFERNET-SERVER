const express = require('express');
const { blogPoster, getBlogs, oneBlog, deleteBlog, updateBlog } = require('../controller/blog.controller');
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

router.post('/post', upload.single('image'), blogPoster);
router.get('/get', getBlogs)
router.route('/get/:id').get(oneBlog)
router.delete('/get/:id', deleteBlog)
router.put('/get/:id', checkingForAdmin, adminIdentifier, upload.single('image'), updateBlog)
// router.get('/get', checkingForAdmin, adminIdentifier, getBlogs);

module.exports = router;