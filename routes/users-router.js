const usersRouter = require('express').Router();
const {
  getUserByName,
  getAllUsers,
  postUser,
} = require('../controllers/users');
const { handle405s } = require('../errors');

usersRouter.route('/').get(getAllUsers).post(postUser).all(handle405s);

usersRouter.route('/:name').get(getUserByName).all(handle405s);

module.exports = usersRouter;
