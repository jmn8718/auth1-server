const express = require('express');
const { ensureLoggedIn } = require('connect-ensure-login');
const router = express.Router();

router.get('/', ensureLoggedIn('/login'), function(req, res, next) {
  res.json(req.params);
});

router.get('/:username', ensureLoggedIn('/login'), function(req, res, next) {
  res.json(req.params);
});

module.exports = router;
