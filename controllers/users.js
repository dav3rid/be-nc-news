const { fetchUserByName, fetchAllUsers, addUser } = require('../models/users');

exports.getUserByName = (req, res, next) => {
  const { name } = req.params;
  fetchUserByName(name)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  const { name } = req.query;
  fetchAllUsers(name)
    .then(users => {
      res.status(200).send({ users });
    })
    .catch(next);
};

exports.postUser = (req, res, next) => {
  addUser(req.body)
    .then(([user]) => {
      res.status(201).send({ user });
    })
    .catch(err => {
      if (err.code === '23505')
        next({ status: 422, msg: 'User name is taken.' });
      else next(err);
    });
};
