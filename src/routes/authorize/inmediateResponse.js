const { Grant } = require('../../db/grant');
const { difference, get, assign } = require('lodash');

async function immediateResponse(client, user, scope, type, areq, done) {
  const audience = get(areq, 'audience', '');
  try {
    const grant = await Grant.findOne(
      {
        userId: user.userId,
        clientId: client.clientId,
        audience,
      },
      { audience: true, scope: true }
    );
    const grantedScopes = get(grant, 'scope', []);
    const scopesToGrant = difference(scope, grantedScopes);
    const allow = !!grant && scopesToGrant.length === 0;
    return done(null, allow);
  } catch (err) {
    done(err);
  }
}

module.exports = {
  immediateResponse,
};
