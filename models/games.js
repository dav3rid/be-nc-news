const connection = require('../db/connection');

exports.fetchGames = (host_id, available) => {
  return connection('games')
    .select('*')
    .modify(query => {
      if (host_id) query.where({ host_id });
      if (available) query.where({ opponent_id: null });
    });
};

exports.fetchGameById = game_id => {
  return connection('games').select('*').where({ game_id });
};

exports.addGame = game => {
  return connection('games').insert(game, '*');
};

exports.updateGameById = (game_id, { opponent_id, game_state }) => {
  return connection('games')
    .where({ game_id })
    .modify(query => {
      if (game_state) query.update({ game_state }, '*');
      if (opponent_id) query.update({ opponent_id }, '*');
    });
};

exports.eraseGameById = game_id => {
  return connection('games')
    .where({ game_id })
    .delete()
    .then(delCount => {
      if (!delCount)
        return Promise.reject({ status: 404, msg: 'Game not found.' });
    });
};

exports.checkIfGameExists = game_id => {
  return connection('games')
    .where({ game_id })
    .then(([game]) => {
      if (!game) return Promise.reject({ status: 404, msg: 'Game not found.' });
    });
};
