const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const { User } = require('../db/user');
const { logger } = require('../logger');
const { compare } = require('./utils');

passport.use(
  new LocalStrategy(async function(username, password, done) {
    logger.debug('local strategy => ' + username);
    try {
      let user = await User.findOne({ username }).exec();
      if (!user) {
        logger.warn('user not found');
        return done(null, false, { message: 'Incorrect username.' });
      }

      let matchPassword = await compare(password, user.password);
      if (!matchPassword) {
        logger.warn('user invalid password');
        return done(null, false, { message: 'Incorrect password.' });
      } else {
        logger.warn('valid user ' + username);
        done(null, user);
      }
    } catch (err) {
      logger.error(err);
      done(err);
    }
  })
);
