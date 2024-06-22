const { genrateFellowId, fellowOnboarding, confirmFellow } = require('../controller/fellow.controller');
const { checkingForAdmin } = require('../middleware/adminchecker.middleware');
const { confirmFellowGen } = require('../middleware/fellow.middleware');
const { adminIdentifier } = require('../middleware/identifier.middleware');

const multer = require('multer')

const router = require('express').Router()

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({storage});

router.post('/generate-id', genrateFellowId);
router.post('/confirm-fellow', confirmFellowGen, confirmFellow);
router.post('/onboarding', upload.single('image'), confirmFellowGen, fellowOnboarding);

module.exports = router;