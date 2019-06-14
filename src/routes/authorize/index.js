const express = require('express');
const { middleware } = require('flowstate');
const { ensureLoggedIn } = require('connect-ensure-login');
const { logger } = require('../../logger');
const { store, manager } = require('../../auth/flowstate');
const { server } = require('../../auth/server');
const router = express.Router();

const { validateClient, validateParams } = require('./validations');
const { validateResponse } = require('./validateResponse');
const { immediateResponse } = require('./inmediateResponse');
const { completeResponse } = require('./completeResponse');
const { renderConsentForm, denyConsent, grantConsent } = require('./consent');

const { useAuthorizeFlowstate } = require('./flow');
// https://auth0.com/docs/protocols/oauth2#authorization-endpoint
router.get(
  '/',
  validateParams,
  validateClient,
  middleware.clean(store, {
    ttl: 259200000, // 3 days
    limit: 5,
  }),
  function(req, res, next) {
    if (req.user) {
      logger.debug('user is authenticated, skip redirect to login');
      return next();
    }

    return useAuthorizeFlowstate(req, res, next);
  },
  server.authorize(validateResponse, immediateResponse, completeResponse),
  renderConsentForm
);

router.post(
  '/',
  ensureLoggedIn('/login'),
  denyConsent,
  server.decision(grantConsent)
);
module.exports = router;
