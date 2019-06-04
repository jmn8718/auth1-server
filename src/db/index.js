const mongoose = require('mongoose');
const { DB_HOST, DB_NAME } = require('../env');
const { logger } = require('../logger');

let db;

function initDb() {
  const DB_URL = `${DB_HOST}/${DB_NAME}`;
  logger.debug(`Connecting to db on ${DB_URL}`);
  mongoose.connect(DB_URL, { useNewUrlParser: true });

  return new Promise(function(resolve, reject) {
    db = mongoose.connection;

    db.on('error', function(err) {
      logger.error('db connection error:');
      logger.error(err);
      reject(err);
    });
    db.once('open', function() {
      logger.debug('Connected to db');
      resolve();
    });
  });
}

async function getDb() {
  if (!db) {
    await initDb();
  }
  return db;
}

module.exports = {
  initDb,
  getDb,
};
