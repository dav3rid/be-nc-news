const express = require('express');
const app = express();
const apiRouter = require('./routes/api-router');
const { handlePsqlErrors, handle404s, handle500s } = require('./errors');

app.use(express.json());

app.use('/api', apiRouter);
app.use('/*', handle404s);

// ERROR HANDLING MIDDLEWARE
app.use(handlePsqlErrors);
app.use(handle500s);

module.exports = app;
