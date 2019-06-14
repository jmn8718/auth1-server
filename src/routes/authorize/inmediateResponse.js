const { logger } = require('../../logger');
const { Grant } = require('../../db/grant');

function immediateResponse(client, user, scope, type, done) {
  // immediate. decide if show consent page
  // if true, will go to complete
  Grant.findOne({ userId: user.userId, clientId: client.clientId }, function(
    err,
    grant
  ) {
    logger.debug(grant);
    done(err, !!grant);
  });
}

module.exports = {
  immediateResponse,
};
