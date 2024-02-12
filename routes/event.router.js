const { createEvent } = require('../controller/event.controller');
const multer = require('multer')
const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/new', upload.single('image'), createEvent);

module.exports = router;