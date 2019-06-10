const { logger } = require('../../logger');
const { generateClients } = require('./clients');
const { generateUsers } = require('./users');

async function generateSeeds() {
  logger.debug('Generating seed data...');

  try {
    await generateUsers();
    await generateClients();
  } catch (err) {
    logger.error(err);
  }

  logger.debug('Finished generating seed data');
}

module.exports = {
  generateSeeds,
};
