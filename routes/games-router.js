const gamesRouter = require('express').Router();
const {
  getGames,
  getGameById,
  postGame,
  patchGameById,
  deleteGameById,
} = require('../controllers/games');
const { handle405s } = require('../errors');

gamesRouter.route('/').get(getGames).post(postGame).all(handle405s);

gamesRouter
  .route('/:game_id')
  .get(getGameById)
  .patch(patchGameById)
  .delete(deleteGameById)
  .all(handle405s);

module.exports = gamesRouter;
