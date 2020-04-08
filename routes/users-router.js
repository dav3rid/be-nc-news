const usersRouter = require('express').Router();
const { getUserById, getAllUsers, postUser } = require('../controllers/users');
const { handle405s } = require('../errors');

usersRouter.route('/').get(getAllUsers).post(postUser).all(handle405s);

usersRouter.route('/:user_id').get(getUserById).all(handle405s);

module.exports = usersRouter;
