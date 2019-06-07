const GitHubStrategy = require('passport-github').Strategy;
const { pick, get, assign } = require('lodash');
const { User } = require('../../db/user');
const { logger } = require('../../logger');
const {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  SERVER_HOST,
  SERVER_PORT,
} = require('../../env');

const PROFILE_FIELDS = ['id', 'displayName', 'username', 'profileUrl'];
const PROFILE_JSON_FIELDS = ['id', 'avatar_url', 'url', 'name'];
const parseProfile = function(profile) {
  const _json = get(profile, '_json', {});
  const emails = get(profile, 'emails', []);
  const email = emails.length > 0 ? emails[0].value : '';
  const fields = pick(profile, PROFILE_FIELDS);
  const userId = `github-${profile.id}`;
  const user = {
    userId,
    email,
    connection: 'github',
    username: userId,
    password: '',
  };
  return assign({}, fields, {
    ...user,
    profile: assign({}, pick(_json, PROFILE_JSON_FIELDS), user),
  });
};

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
        scope: 'user,user:email',
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
