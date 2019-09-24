const apiRouter = require('express').Router();
const { getAllTopics } = require('../controllers/topics');

apiRouter.route('/topics').get(getAllTopics);

module.exports = apiRouter;
