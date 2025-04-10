const { genrateFellowId, fellowOnboarding, confirmFellow, getFellows, fellowLogin, fellowProfile } = require('../controller/fellow.controller');
const { checkingForAdmin } = require('../middleware/adminchecker.middleware');
const { confirmFellowGen, fellowAuth } = require('../middleware/fellow.middleware');
const { adminIdentifier } = require('../middleware/identifier.middleware');

const multer = require('multer');

const router = require('express').Router()

const storage = multer.diskStorage({
  filename: (_req, file, cb) => {
      cb(null, `${Date.now()}_${file.originalname}`);
  }
});

const upload = multer({storage});

router.post("/login", fellowLogin);

router.get("/profile", fellowAuth, fellowProfile);

router.post('/generate-id', checkingForAdmin, adminIdentifier, genrateFellowId);
router.get('/', checkingForAdmin, adminIdentifier, getFellows);
router.post('/confirm-fellow', confirmFellowGen, confirmFellow);
router.post('/onboarding', upload.single('image'), confirmFellowGen, fellowOnboarding);

module.exports = router;