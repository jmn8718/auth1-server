const passport = require('passport');

const localStragety = require('./local');
const githubStrategy = require('./github');
const googleStrategy = require('./google');
const clientPasswordStrategy = require('./clientPassword');
const httpBearerStrategy = require('./httpBearer');

localStragety.registerStrategy(passport);
githubStrategy.registerStrategy(passport);
googleStrategy.registerStrategy(passport);
clientPasswordStrategy.registerStrategy(passport);
httpBearerStrategy.registerStrategy(passport);
