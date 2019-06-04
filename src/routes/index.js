const express = require('express');
const { logger } = require('../logger');
const usersRouter = require('./users');

const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

function applyRoutes(app) {
  logger.debug('Applying routes');

  app.use('/', router);
  app.use('/users', usersRouter);
}

module.exports = {
  applyRoutes,
};
