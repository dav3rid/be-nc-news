const connection = require('../db/connection');

exports.fetchUserById = user_id => {
  return connection('users')
    .select('*')
    .where({ user_id })
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
