const { ourCampaignPost, getCampaign } = require('../controller/campaign.controller');
const multer = require('multer');
const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(`${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/post', upload.single('iamge'), ourCampaignPost);

router.get('/get', getCampaign);

module.exports = router;