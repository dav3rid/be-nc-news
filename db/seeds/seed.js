const { userData, gameData } = require('../data/test');

exports.seed = connection => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('users').insert(userData))
    .then(() => connection('games').insert(gameData));
};
