const { ourCampaignPost, getCampaign, singleCampagin, fellowPostCampaign } = require('../controller/campaign.controller');
const multer = require('multer');
const { fellowAuth } = require('../middleware/fellow.middleware');
const router = require('express').Router();

const storage = multer.diskStorage({
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({storage})

router.post("/", fellowAuth, upload.array("files"), fellowPostCampaign);

router.post('/post', upload.single('file'), ourCampaignPost)

router.get('/', getCampaign);

router.route('/get/:id').get(singleCampagin)

module.exports = router;