const express = require('express');
const router = express.Router();

const tokenRouter = require('./token');
const authRouter = require('./auth');
const socialRouter = require('./social');

router.use('/', socialRouter);
router.use('/authorize', authRouter);
router.use('/token', tokenRouter);

module.exports = router;
