const gamesRouter = require('express').Router();
const {
  getGames,
  getGameById,
  postGame,
  patchGameById,
} = require('../controllers/games');
const { handle405s } = require('../errors');

gamesRouter.route('/').get(getGames).post(postGame).all(handle405s);

gamesRouter
  .route('/:game_id')
  .get(getGameById)
  .patch(patchGameById)
  .all(handle405s);

module.exports = gamesRouter;
