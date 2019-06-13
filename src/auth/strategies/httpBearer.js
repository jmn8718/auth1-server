const BearerStrategy = require('passport-http-bearer').Strategy;
const { AccessToken } = require('../../db/accessToken');
const { User } = require('../../db/user');
const { logger } = require('../../logger');
const { verify } = require('../token');

function registerStrategy(passport) {
  logger.debug('Registering Http Bearer strategy');

  passport.use(
    new BearerStrategy(async function(token, done) {
      logger.debug('accessToken => ' + token);
      try {
        const accessToken = await AccessToken.findOne(
          { token },
          { scope: true, userId: true, clientId: true, _id: false }
        );
        if (!accessToken) {
          return done(null, false);
        }
        // TODO pass issuer and audience to verify token
        const { error } = verify(token);
        if (error) {
          done(error);
        }

        const user = await User.findOne({ userId: accessToken.userId });
        if (!user) {
          return done(null, false);
        }

        return done(null, user, {
          scope: accessToken.scope,
          clientId: accessToken.clientId,
        });
      } catch (err) {
        done(err);
      }
    })
  );
}

module.exports = {
  registerStrategy,
};
