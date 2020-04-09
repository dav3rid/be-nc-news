const {
  fetchGames,
  fetchGameById,
  addGame,
  updateGameById,
} = require('../models/games');

exports.getGames = (req, res, next) => {
  const { host_id, available_only } = req.query;
  fetchGames(host_id, available_only)
    .then(games => {
      res.status(200).send({ games });
    })
    .catch(next);
};

exports.getGameById = (req, res, next) => {
  const { game_id } = req.params;
  fetchGameById(game_id)
    .then(([game]) => {
      res.status(200).send({ game });
    })
    .catch(next);
};

exports.postGame = ({ body: { game_state, ...rest } }, res, next) => {
  const game = { game_state: JSON.stringify(game_state), ...rest };
  addGame(game)
    .then(([{ game_state, ...rest }]) => {
      const game = { game_state: JSON.parse(game_state), ...rest };
      res.status(201).send({ game });
    })
    .catch(next);
};

exports.patchGameById = (req, res, next) => {
  const { game_id } = req.params;
  const game_state = JSON.stringify(req.body);
  updateGameById(game_id, game_state)
    .then(([{ game_state, ...rest }]) => {
      const game = { game_state: JSON.parse(game_state), ...rest };
      res.status(200).send({ game });
    })
    .catch(next);
};

// exports.getAvailableGames = (req, res, next) => {
//   fetchGames(null, true).then(games => {
//     console.log(games);
//   });
// };
