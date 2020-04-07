const connection = require('../db/connection');

exports.fetchAllGames = () => {
  return connection('games').select('*');
};

exports.fetchGameById = game_id => {
  return connection('games').select('*').where({ game_id });
};
