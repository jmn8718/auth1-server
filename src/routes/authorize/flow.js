const { logger } = require('../../logger');
const { store } = require('../../auth/flowstate');

function useAuthorizeFlowstate(req, res) {
  logger.debug(
    'Redirected to /authorize => ' + JSON.stringify(req.session.state)
  );
  const {
    client_id,
    response_type,
    redirect_uri,
    state = '',
    scope = '',
  } = req.query;
  const authorizeState = {
    name: 'authorize',
    client_id,
    response_type,
    redirect_uri,
    scope,
    state,
    returnTo: req.originalUrl, // after complete flow, redirect to the original url
  };

  store.save(req, authorizeState, null, function(err, handle) {
    logger.debug(
      `Saving authorize state and redirecting to /login?state=${handle}`
    );
    res.redirect(`/login?state=${handle}`);
  });
}

module.exports = { useAuthorizeFlowstate };
