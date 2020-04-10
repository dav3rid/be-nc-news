const {
  fetchGames,
  fetchGameById,
  addGame,
  updateGameById,
  eraseGameById,
  checkIfGameExists,
} = require('../models/games');

exports.getGames = (req, res, next) => {
  const { host_id, available } = req.query;
  fetchGames(host_id, available)
    .then(games => {
      res.status(200).send({ games });
    })
    .catch(next);
};

exports.getGameById = (req, res, next) => {
  const { game_id } = req.params;
  return Promise.all([fetchGameById(game_id), checkIfGameExists(game_id)])
    .then(([[game]]) => {
      res.status(200).send({ game });
    })
    .catch(next);
};

exports.postGame = (req, res, next) => {
  addGame(req.body)
    .then(([{ game_state, ...rest }]) => {
      const game = { game_state: JSON.parse(game_state), ...rest };
      res.status(201).send({ game });
    })
    .catch(next);
};

exports.patchGameById = (req, res, next) => {
  const { game_id } = req.params;
  updateGameById(game_id, req.body)
    .then(([{ game_state, ...rest }]) => {
      const game = { game_state: JSON.parse(game_state), ...rest };
      res.status(200).send({ game });
    })
    .catch(next);
};

exports.deleteGameById = (req, res, next) => {
  const { game_id } = req.params;
  eraseGameById(game_id)
    .then(() => {
      res.sendStatus(204);
    })
    .catch(next);
};
