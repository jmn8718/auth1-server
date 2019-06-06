const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { assign, pick } = require('lodash');
const { User } = require('../../db/user');
const { logger } = require('../../logger');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_HOST,
  SERVER_PORT,
} = require('../../env');

const PROFILE_FIELDS = ['id', 'displayName', 'username'];
const PROFILE_JSON_FIELDS = ['picture', 'name'];
function registerStrategy(passport) {
  logger.debug('Registering google strategy');
  const callbackURL = `${SERVER_HOST}:${SERVER_PORT}/social/google/callback`;
  logger.debug('github callbackURL: ' + callbackURL);
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL,
      },
      function(accessToken, refreshToken, profile, cb) {
        const userId = `google-${profile.id}`;
        const userData = {
          userId,
          connection: 'google',
          username: userId,
          password: '',
          profile: assign(
            {},
            pick(profile, PROFILE_FIELDS),
            pick(profile._json, PROFILE_JSON_FIELDS)
          ),
        };

        User.findOneAndUpdate(
          { userId },
          userData,
          { upsert: true, new: true },
          function(err, user) {
            return cb(err, user);
          }
        );
      }
    )
  );
}

module.exports = {
  registerStrategy,
};
