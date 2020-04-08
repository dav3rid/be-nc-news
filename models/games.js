const connection = require('../db/connection');

exports.fetchAllGames = host_id => {
  return connection('games')
    .select('*')
    .modify(query => {
      if (host_id) query.where({ host_id });
    });
};

exports.fetchGameById = game_id => {
  return connection('games').select('*').where({ game_id });
};

exports.addGame = game => {
  return connection('games').insert(game, '*');
};

exports.updateGameById = (game_id, game_state) => {
  return connection('games').where({ game_id }).update({ game_state }, '*');
};
