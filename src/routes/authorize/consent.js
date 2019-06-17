const { logger } = require('../../logger');
const { Grant } = require('../../db/grant');
const { get } = require('lodash');

function renderConsentForm(req, res) {
  const { transactionID, client, user, locals } = req.oauth2;
  const scope = get(req, 'oauth2.req.scope', []);
  const audience = get(req, 'oauth2.req.audience', '');
  logger.debug(
    'consent +=> ' +
      JSON.stringify({
        userId: user.userId,
        clientId: client.clientId,
        scope,
        audience,
      })
  );
  // TODO get scopes and descriptions to render proper screen
  const form = {
    action: `/authorize?transaction_id=${transactionID}`,
    client,
    title: 'Consent',
    buttonLabel: 'Accept',
    user: req.user,
    name: user.name || user.username,
    scopes: scope.map(function(name) {
      return { value: name, description: name };
    }),
  };

  res.render('consentForm', form);
}

function prepare(req, res, next) {
  const session = req.session;
  const scope = get(req, 'body.scope', []);

  if (!Array.isArray(scope)) {
    next(new Error('Scope must be an array'));
  }
  session.consentInfo = {
    allow: !req.body.cancel,
    scope: req.body.scope || [],
    audience: req.body.audience || '',
  };
  next();
}

function denyConsent(req, res, next) {
  // TODO logout as the user did not consent
  const allow = get(req, 'session.consentInfo.allow', false);
  if (!allow) {
    logger.debug('Consent not accepted, login out the user');
    // next(new Error('consent denied'));
    return res.redirect('/logout');
  }
  next();
}

async function grantConsent(req, next) {
  try {
    const user = get(req, 'user', {});
    const client = get(req, 'oauth2.client', {});
    const audience = get(req, 'oauth2.req.audience', '');
    const scope = get(req, 'oauth2.req.scopesToGrant', []);
    const grantData = {
      userId: user.userId,
      clientId: client.clientId,
      audience,
    };
    logger.debug(
      'grant => ' + JSON.stringify(grantData) + ' ..scopes: ' + scope.join(' ')
    );
    const grant = await Grant.findOneAndUpdate(
      grantData,
      { ...grantData, scope },
      {
        upsert: true,
        new: true,
      }
    );
    logger.debug('grant saved => ' + JSON.stringify(grant));
    next();
  } catch (err) {
    logger.error(err);
    return next(new Error('Error granting consent'));
  }
}

module.exports = {
  renderConsentForm,
  prepare,
  denyConsent,
  grantConsent,
};
