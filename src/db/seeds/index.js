const { logger } = require('../../logger');
const { generateClients } = require('./clients');

async function generateSeeds() {
  logger.debug('Generating seed data...');

  try {
    await generateClients();
  } catch (err) {
    logger.error(err);
  }

  logger.debug('Finished generating seed data');
}

module.exports = {
  generateSeeds,
};
