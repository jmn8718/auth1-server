const { logger } = require('../../logger');
const { Grant } = require('../../db/grant');
const { get } = require('lodash');

function renderConsentForm(req, res) {
  const { transactionID, client, user } = req.oauth2;
  logger.debug(
    'consent +=> ' +
      JSON.stringify({ userId: user.userId, clientId: client.clientId })
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
  if (req.body.cancel) {
    next(new Error('consent denied'));
  }
  next();
}

async function grantConsent(req, res, next) {
  try {
    const user = get(req, 'user', {});
    const client = get(req, 'oauth2.client', {});
    const grantData = { userId: user.userId, clientId: client.clientId };
    logger.debug('grant => ' + JSON.stringify(grantData));
    const grant = await Grant.findOneAndUpdate(grantData, grantData, {
      upsert: true,
      new: true,
    });
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
