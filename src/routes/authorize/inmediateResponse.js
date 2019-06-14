const { Grant } = require('../../db/grant');
const { difference, get, assign } = require('lodash');

async function immediateResponse(
  client,
  user,
  scope,
  type,
  areq,
  locals,
  done
) {
  let info = {};
  locals = locals || {};
  locals.audience = get(areq, 'audience', '');
  try {
    const grant = await Grant.findOne(
      {
        userId: user.userId,
        clientId: client.clientId,
        audience: locals.audience,
      },
      { audience: true, scope: true }
    );
    const grantedScopes = get(grant, 'scope', []);
    const scopesToGrant = difference(scope, grantedScopes);
    const allow = !!grant && scopesToGrant.length === 0;
    locals.scopesToGrant = scopesToGrant;
    assign(info, locals);
    return done(null, allow, info, locals);
  } catch (err) {
    done(err);
  }
}

module.exports = {
  immediateResponse,
};
