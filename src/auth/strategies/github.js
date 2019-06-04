const GitHubStrategy = require('passport-github').Strategy;
const { pick } = require('lodash');
const { User } = require('../../db/user');
const { logger } = require('../../logger');
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SERVER_HOST,
  SERVER_PORT,
} = require('../../env');

const PROFILE_FIELDS = ['id', 'displayName', 'username', 'profileUrl'];
function registerStrategy(passport) {
  logger.debug('Registering github strategy');
  const callbackURL = `${SERVER_HOST}:${SERVER_PORT}/social/github/callback`;
  logger.debug('github callbackURL: ' + callbackURL);
  passport.use(
    new GitHubStrategy(
      {
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL,
      },
      function(accessToken, refreshToken, profile, cb) {
        const userId = `github-${profile.id}`;
        const userData = {
          userId,
          connection: 'github',
          username: userId,
          password: '',
          profile: pick(profile, PROFILE_FIELDS),
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
