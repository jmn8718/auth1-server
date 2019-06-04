const passport = require('passport');

const localStragety = require('./local');
const githubStrategy = require('./github');
const googleStrategy = require('./google');

localStragety.registerStrategy(passport);
githubStrategy.registerStrategy(passport);
googleStrategy.registerStrategy(passport);
