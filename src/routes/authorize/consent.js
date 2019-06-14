const { logger } = require('../../logger');
const { Grant } = require('../../db/grant');
const { get } = require('lodash');

function renderConsentForm(req, res) {
  const { transactionID, client, user, locals } = req.oauth2;
  const scopesToGrant = get(locals, 'scopesToGrant', []);
  const audience = get(locals, 'audience', '');
  logger.debug(
    'consent +=> ' +
      JSON.stringify({
        userId: user.userId,
        clientId: client.clientId,
        scope: scopesToGrant,
        audience,
      })
  );
  res.render('consentForm', {
    action: `/authorize?transaction_id=${transactionID}`,
    client,
    title: 'Consent',
    buttonLabel: 'Accept',
    isAuthenticated: true,
    user: req.user,
  });
}

function denyConsent(req, res, next) {
  // TODO logout as the user did not consent
  if (req.body.cancel) {
    next(new Error('consent denied'));
  }
  next();
}

async function grantConsent(req, next) {
  try {
    const user = get(req, 'user', {});
    const client = get(req, 'oauth2.client', {});
    const audience = get(req, 'oauth2.info.audience', '');
    const scope = get(req, 'oauth2.info.scopesToGrant', []);
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
      { ...grantData, $push: { scope: { $each: scope } } },
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
  denyConsent,
  grantConsent,
};
