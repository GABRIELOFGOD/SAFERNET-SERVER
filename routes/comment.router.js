const express = require('express');
const { postComment } = require('../controller/comment.controller');
const router = express.Router();

router.post('/post', postComment);

module.exports = router;