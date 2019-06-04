const passport = require('passport');

const localStragety = require('./local');
const githubStrategy = require('./github');

localStragety.registerStrategy(passport);
githubStrategy.registerStrategy(passport);
