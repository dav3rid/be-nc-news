const { fetchAllGames, fetchGameById, addGame } = require('../models/games');

exports.getAllGames = (req, res, next) => {
  const { host_id } = req.query;
  fetchAllGames(host_id)
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
  addGame(game).then(([{ game_state, ...rest }]) => {
    const game = { game_state: JSON.parse(game_state), ...rest };
    res.status(201).send({ game });
  });
};
