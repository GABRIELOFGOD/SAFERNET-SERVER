const multer = require('multer');
const { lawReportPoster } = require('../../controller/LAW/report.controller');

const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/post', upload.single('evidence'), lawReportPoster)

module.exports = router