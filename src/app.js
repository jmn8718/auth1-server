const express = require('express');
const path = require('path');

const { applyRoutes } = require('./routes');
const { applyBefore, applyAfter } = require('./middleware');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

applyBefore(app);
applyRoutes(app);
applyAfter(app);

module.exports = app;
