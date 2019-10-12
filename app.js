const express = require('express');
const cors = require('cors');
const app = express();
const apiRouter = require('./routes/api-router');
const {
  handleCustomErrors,
  handlePsql400Errors,
  handlePsql422Errors,
  handle404s,
  handle500s
} = require('./errors');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/*', handle404s);

// ERROR HANDLING MIDDLEWARE
app.use(handleCustomErrors);
app.use(handlePsql400Errors);
app.use(handlePsql422Errors);
app.use(handle500s);

module.exports = app;
