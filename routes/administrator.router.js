const { createAdmin, loginAdmin } = require('../controller/administrator.controller');

const router = require('express').Router();

router.route('/create').post(createAdmin)
router.post('/login', loginAdmin)

module.exports = router;