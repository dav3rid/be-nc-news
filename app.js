const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const cors = require('cors');
const apiRouter = require('./routes/api-router');
const {
  handleCustomErrors,
  handlePsql400Errors,
  handlePsql422Errors,
  handle404s,
  handle500s,
} = require('./errors');
const { handleConnection } = require('./io-handlers');

app.use(cors());
app.use(express.json());

app.use('/api', apiRouter);
app.use('/*', handle404s);

// ERROR HANDLING MIDDLEWARE
app.use(handleCustomErrors);
app.use(handlePsql400Errors);
app.use(handlePsql422Errors);
app.use(handle500s);

// io handlers
io.on('connection', handleConnection);

module.exports = { app, server, io };
