const articlesRouter = require('express').Router();
const { getArticleById, patchArticleById } = require('../controllers/articles');
const {
  postComment,
  getCommentsByArticleId
} = require('../controllers/comments');
const { handle405s } = require('../errors');

articlesRouter
  .route('/:article_id/comments')
  .post(postComment)
  .get(getCommentsByArticleId)
  .all(handle405s);

articlesRouter
  .route('/:article_id')
  .get(getArticleById)
  .patch(patchArticleById)
  .all(handle405s);

module.exports = articlesRouter;
