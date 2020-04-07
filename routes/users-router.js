const usersRouter = require('express').Router();
const {
  getUserByUsername,
  getAllUsers,
  postUser,
} = require('../controllers/users');
const { handle405s } = require('../errors');

usersRouter.route('/').get(getAllUsers).post(postUser).all(handle405s);

usersRouter.route('/:username').get(getUserByUsername).all(handle405s);

module.exports = usersRouter;
