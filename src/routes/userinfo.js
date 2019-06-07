const express = require('express');
const { indexOf, assign, get, pick } = require('lodash');
const { passport } = require('../auth');
const { User } = require('../db/user');
const { logger } = require('../logger');
const router = express.Router();

// https://auth0.com/docs/scopes/current/oidc-scopes#standard-claims
// https://openid.net/specs/openid-connect-core-1_0.html#ScopeClaims
const PROFILE_FIELDS = [
  'name',
  'family_name',
  'given_name',
  'middle_name',
  'nickname',
  'picture',
  'locale',
  'updated_at',
];
const EMAIL_FIELDS = ['email', 'email_verified'];
const ADDRESS_FIELDS = ['address'];
const PHONE_FIELDS = ['phone_number', 'phone_number_verified'];

const getScopeFields = function(scopes) {
  const fields = [];

  if (indexOf(scopes, 'profile') > -1) {
    fields.push(...PROFILE_FIELDS);
  }
  if (indexOf(scopes, 'email') > -1) {
    fields.push(...EMAIL_FIELDS);
  }
  if (indexOf(scopes, 'address') > -1) {
    fields.push(...ADDRESS_FIELDS);
  }
  if (indexOf(scopes, 'phone') > -1) {
    fields.push(...PHONE_FIELDS);
  }
  return fields;
};

router.get(
  '/',
  passport.authenticate(['bearer'], {
    session: false,
  }),
  async function(req, res, next) {
    const { user, authInfo } = req;

    const scopes = get(authInfo, 'scope', '').split(' ');
    let userinfo = {};
    if (indexOf(scopes, 'openid') > -1) {
      try {
        const userdb = await User.findById(user._id, { profile: true });
        if (userdb) {
          const profile = get(userdb, 'profile', {});
          const fields = pick(profile, getScopeFields(scopes));
          assign(userinfo, fields);
        }
      } catch (err) {
        logger.error(err);
      }
    }
    res.json(userinfo);
  }
);

module.exports = router;
