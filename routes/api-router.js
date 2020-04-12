const apiRouter = require('express').Router();
const usersRouter = require('./users-router');
const gamesRouter = require('./games-router');

const { handle405s } = require('../errors');

apiRouter.use('/users', usersRouter);
apiRouter.use('/games', gamesRouter);
apiRouter.route('/').all(handle405s);

module.exports = apiRouter;
