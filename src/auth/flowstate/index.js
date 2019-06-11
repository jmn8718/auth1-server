const flowstate = require('flowstate');
const qs = require('querystring');
const { get } = require('lodash');
const { generateClaimsAndSign } = require('../token');
const { logger } = require('../../logger');
const { generateAuthorizationCode } = require('../../db/authorizationCode');
const Manager = flowstate.Manager;
const store = new flowstate.SessionStore();
const manager = new Manager(store);

manager.use(
  'authorize',
  [],
  [
    function(req, res, next) {
      logger.debug(
        'Executing authorize resume middleware chain => ' +
          JSON.stringify(req.session.state)
      );
      next();
    },
    manager.complete('authorize'),
    function(req, res, next) {
      logger.debug(
        'Completing authorize transaction and redirecting user back to client => ' +
          JSON.stringify(req.session.state)
      );
      next();
    },
    async function(req, res, next) {
      const user = get(req, 'locals.user', {});
      const state = get(req, 'state', {});
      if (state.response_type === 'token') {
        const token = generateClaimsAndSign({ user_id: user.userId });
        const query = qs.stringify({ access_token: token, state: state.state });
        res.redirect(`${state.redirect_uri}#${query}`);
      } else if (state.response_type === 'code') {
        try {
          const { code } = await generateAuthorizationCode({
            clientId: state.client_id,
            redirectUri: state.redirect_uri,
            scope: state.scope,
            userId: user.userId,
          });
          const query = qs.stringify({ code, state: state.state });

          res.redirect(`${state.redirect_uri}#${query}`);
        } catch (err) {
          next(err);
        }
      } else {
        next(new Error('Invalid response_type'));
      }
    },
  ]
);

manager.transition('authorize', 'login', [
  function(req, res, next) {
    logger.debug(
      'Transition from /login to authorize => ' +
        JSON.stringify(req.session.state)
    );
    next();
  },
  function(req, res, next) {
    req.locals = req.locals || {};
    req.locals.user = req.user || {};
    next();
  },
]);

module.exports = {
  manager,
  store,
};
