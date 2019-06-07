const BearerStrategy = require('passport-http-bearer').Strategy;
const { AccessToken } = require('../../db/accessToken');
const { User } = require('../../db/user');
const { logger } = require('../../logger');

function registerStrategy(passport) {
  logger.debug('Registering Http Bearer strategy');

  passport.use(
    new BearerStrategy(function(token, done) {
      logger.debug('accessToken => ' + token);
      AccessToken.findOne({ token }, function(err, accessToken) {
        if (err) {
          return done(err);
        }
        if (!accessToken) {
          return done(null, false);
        }
        User.findOne({ userId: accessToken.userId }, function(err, user) {
          if (err) {
            return done(err);
          }
          if (!user) {
            return done(null, false);
          }

          return done(null, user, { scope: accessToken.scope });
        });
      });
    })
  );
}

module.exports = {
  registerStrategy,
};
