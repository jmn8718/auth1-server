const BasicStrategy = require('passport-http').BasicStrategy;
const { AccessToken } = require('../../db/accessToken');
const { User } = require('../../db/user');
const { logger } = require('../../logger');

function registerStrategy(passport) {
  logger.debug('Registering Http Bearer strategy');

  passport.use(
    new BasicStrategy(function(username, password, done) {
      logger.debug('basic user => ' + username + ' . ' + password);
      User.findOne({ username, connection: 'local' }, function(err, user) {
        if (err) {
          return done(err);
        }
        console.log(user);
        if (!user) {
          return done(null, false);
        }

        return done(null, user);
      });
    })
  );
}

module.exports = {
  registerStrategy,
};
