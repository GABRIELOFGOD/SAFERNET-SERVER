const multer = require('multer');
const { makeReport, getReports } = require('../controller/report.controller');
const { checkingForAdmin } = require('../middleware/adminchecker.middleware');
const { adminIdentifier } = require('../middleware/identifier.middleware');

const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/post', upload.single('file'), makeReport);

router.get('/get', checkingForAdmin, adminIdentifier, getReports)

module.exports = router;