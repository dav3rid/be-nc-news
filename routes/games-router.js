const gamesRouter = require('express').Router();
const { getAllGames, getGameById } = require('../controllers/games');
const { handle405s } = require('../errors');

gamesRouter.route('/').get(getAllGames).all(handle405s);

gamesRouter.route('/:game_id').get(getGameById).all(handle405s);

module.exports = gamesRouter;
