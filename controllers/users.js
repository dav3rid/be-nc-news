const { fetchUserById, fetchAllUsers, addUser } = require('../models/users');

exports.getUserById = (req, res, next) => {
  const { user_id } = req.params;
  fetchUserById(user_id)
    .then(user => {
      res.status(200).send({ user });
    })
    .catch(next);
};

exports.getAllUsers = (req, res, next) => {
  fetchAllUsers()
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
    .catch(next);
};
