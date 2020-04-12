const connection = require('../db/connection');

exports.fetchUserByName = name => {
  return connection('users')
    .select('*')
    .where({ name })
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: 'User not found.' });
      } else {
        return user;
      }
    });
};

exports.fetchAllUsers = name => {
  return connection('users')
    .select('*')
    .modify(query => {
      if (name) query.where({ name });
    });
};

exports.addUser = user => {
  return connection('users').insert(user, '*');
};
