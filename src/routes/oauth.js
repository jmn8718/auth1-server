const express = require('express');
const router = express.Router();

const tokenRouter = require('./token');
const socialRouter = require('./social');

router.use('/', socialRouter);
router.use('/token', tokenRouter);

module.exports = router;
