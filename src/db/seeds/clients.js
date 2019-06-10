const { forEach } = require('lodash');
const { Client } = require('../client');
const { logger } = require('../../logger');
const { CLIENTS } = require('../data');

async function generateClient(clientData) {
  logger.debug(`Generating client => ${JSON.stringify(clientData)}`);
  let client = await Client.findOneAndUpdate(
    { clientId: clientData.clientId },
    clientData,
    { upsert: true, new: true }
  );
  logger.debug(`CLIENT created => ${JSON.stringify(client)}`);
  return client;
}

async function generateClients() {
  logger.debug('Generating clients seeds...');

  try {
    forEach(CLIENTS, async function(client) {
      await generateClient(client);
    });
  } catch (err) {
    logger.err(err);
  }

  logger.debug('Finished generating client seeds');
}

module.exports = {
  generateClient,
  generateClients,
};
