const { forEach } = require('lodash');
const { User } = require('../user');
const { logger } = require('../../logger');
const { USERS } = require('../data');
const { hash } = require('../../auth/utils');

async function generateUser(data) {
  logger.debug(`Generating user => ${JSON.stringify(data)}`);
  let user = await User.findOneAndUpdate({ userId: data.userId }, data, {
    upsert: true,
    new: true,
  });
  logger.debug(`User created => ${JSON.stringify(user)}`);
  return user;
}

async function generateUsers() {
  logger.debug('Generating users seeds...');

  try {
    forEach(USERS, async function(user) {
      user.password = await hash(user.password);
      await generateUser(user);
    });
  } catch (err) {
    logger.err(err);
  }

  logger.debug('Finished generating users seeds');
}

module.exports = {
  generateUser,
  generateUsers,
};
