const { forEach } = require('lodash');
const { Client } = require('../client');
const { logger } = require('../../logger');

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

const CLIENTS = [
  {
    name: 'client demo',
    clientId: 'id2019',
    clientSecret: 'secret2019',
    redirectUri: 'http://localhost:8080/users/consent',
  },
  {
    name: 'auth app',
    clientId: 'auth19id',
    clientSecret: 'auth10secret',
    redirectUri: 'http://localhost:8080/users/consent',
  },
];

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
