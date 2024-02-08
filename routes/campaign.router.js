const { ourCampaignPost } = require('../controller/campaign.controller');
const multer = require('multer');
const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(`${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage});

router.post('/post', upload.single('iamge'), ourCampaignPost);

module.exports = router