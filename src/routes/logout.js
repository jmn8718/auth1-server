const express = require('express');
const router = express.Router();

router.get('/', function(req, res) {
  req.session.destroy();
  req.logout();
  res.redirect('/login');
});

module.exports = router;
