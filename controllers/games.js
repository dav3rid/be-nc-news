const { fetchAllGames, fetchGameById } = require('../models/games');

exports.getAllGames = (req, res, next) => {
  fetchAllGames()
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
