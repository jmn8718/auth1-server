const express = require('express');
const router = express.Router();
const usersRouter = require('./users');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function applyRoutes(app) {
  app.use('/', router);
  app.use('/users', usersRouter);
}

module.exports = {
  applyRoutes,
};
