const articlesRouter = require('express').Router();
const { getArticleById } = require('../controllers/articles');
const { handle405s } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .all(handle405s);

module.exports = articlesRouter;
