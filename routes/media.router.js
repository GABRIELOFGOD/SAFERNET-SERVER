const { upload } = require("../controller/blog.controller");
const { postMediaPhoto, getAllMediaPhoto } = require("../controller/media.controller");
const { checkingForAdmin } = require("../middleware/adminchecker.middleware");
const { adminIdentifier } = require("../middleware/identifier.middleware");

const router = require("express").Router();

router.route('').post(checkingForAdmin, adminIdentifier, upload.single("cover_photo"), postMediaPhoto).get(getAllMediaPhoto);

module.exports = router;