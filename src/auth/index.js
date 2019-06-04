const passport = require('passport');
const { logger } = require('../logger');
const { User } = require('../db/user');

passport.serializeUser(function(user, done) {
  logger.debug('SERIALIZE => ' + JSON.stringify(user));
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  logger.debug('DESERIALIZE => ' + id);
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

require('./strategies');

module.exports = {
  passport,
};
