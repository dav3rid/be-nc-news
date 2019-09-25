const {
  fetchArticleById,
  updateArticleById,
  fetchAllArticles
} = require('../models/articles');

exports.getArticleById = (req, res, next) => {
  const article_id = req.params.article_id;
  fetchArticleById(article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleById(article_id, inc_votes)
    .then(updatedArticle => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  const { sort_by } = req.query;
  const { order } = req.query;
  const { author } = req.query;
  const { topic } = req.query;
  fetchAllArticles(sort_by, order, author, topic)
    .then(articles => {
      res.status(200).send({ articles });
    })
    .catch(err => {
      if (!err.msg) {
        err.msg = 'Bad request - invalid query.';
      }
      next(err);
    });
};
