const subscriber = require('../controller/newsletter.controller');

const router = require('express').Router();

router.route('/subscribe').post(subscriber)

module.exports = router;