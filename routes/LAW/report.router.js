const { lawReportPoster } = require('../../controller/LAW/report.controller');

const router = require('express').Router();

router.post('/post', lawReportPoster)

module.exports = router