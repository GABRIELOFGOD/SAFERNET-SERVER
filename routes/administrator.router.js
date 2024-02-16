const { createAdmin, loginAdmin, adminGetter } = require('../controller/administrator.controller');
const { checkingForAdmin } = require('../middleware/adminchecker.middleware');
const { adminIdentifier } = require('../middleware/identifier.middleware');

const router = require('express').Router();

router.route('/create').post(createAdmin)
router.post('/login', loginAdmin)
router.get('/getter', checkingForAdmin, adminIdentifier, adminGetter)

module.exports = router;