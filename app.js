const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { handle404s, handle500s } = require('./errors');

app.use('/api', apiRouter);

app.use('/*', handle404s);

// ERROR HANDLING MIDDLEWARE
app.use(handle500s);

module.exports = app;
