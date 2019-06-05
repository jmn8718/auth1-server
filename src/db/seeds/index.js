const { Client } = require('../client');
const { logger } = require('../../logger');

async function generateSeeds() {
  logger.debug('Generating seed data...');

  const client1Data = {
    name: 'client demo',
    clientId: 'id2019',
    clientSecret: 'secret2019',
    redirectUri: 'http://localhost:8080/users/consent',
  };
  logger.debug('Generating client => ' + JSON.stringify(client1Data));

  try {
    let client = await Client.findOneAndUpdate(
      { clientId: client1Data.clientId },
      client1Data,
      { upsert: true, new: true }
    );
    logger.debug(client);
  } catch (err) {
    logger.error(err);
  }

  logger.debug('Finished generating seed data');
}

module.exports = {
  generateSeeds,
};
