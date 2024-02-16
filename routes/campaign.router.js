const { ourCampaignPost, getCampaign } = require('../controller/campaign.controller');
const multer = require('multer');
const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage})

// router.route('/post', upload.single('file')).post(ourCampaignPost);
router.post('/post', upload.single('file'), ourCampaignPost)

router.get('/get', getCampaign);

module.exports = router;