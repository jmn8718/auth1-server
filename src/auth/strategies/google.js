const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const { assign, pick, get } = require('lodash');
const { User } = require('../../db/user');
const { logger } = require('../../logger');
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  SERVER_HOST,
  SERVER_PORT,
} = require('../../env');

const PROFILE_FIELDS = ['id', 'displayName', 'username'];
const PROFILE_JSON_FIELDS = ['picture', 'name', 'email', 'email_verified'];
const parseProfile = function(profile) {
  const userId = `google-${profile.id}`;
  const emails = get(profile, 'emails', []);
  const email = emails.length > 0 ? emails[0].value : '';
  const profileFields = assign(
    {},
    pick(profile, PROFILE_FIELDS),
    pick(profile._json, PROFILE_JSON_FIELDS)
  );
  return {
    userId,
    connection: 'google',
    username: userId,
    password: '',
    email,
    _json: profileFields,
  };
};

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
        const userData = parseProfile(profile);

        User.findOneAndUpdate(
          { userId: userData.userId },
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
