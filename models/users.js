const connection = require('../db/connection');

exports.fetchUserByUsername = username => {
  return connection('users')
    .select('*')
    .where({ username })
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: 'User not found.' });
      } else {
        return user;
      }
    });
};

exports.fetchAllUsers = () => {
  return connection('users').select('*');
};

exports.addUser = user => {
  return connection('users').insert(user, '*');
};
