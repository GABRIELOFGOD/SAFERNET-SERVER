const multer = require('multer');
const { lawReportPoster, caseReportTrack } = require('../../controller/LAW/report.controller');

const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/post', upload.single('evidence'), lawReportPoster)
router.post('/track', caseReportTrack)

module.exports = router