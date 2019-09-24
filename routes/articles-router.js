const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/articles');
const { handle405s } = require('../errors');

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

module.exports = articlesRouter;
