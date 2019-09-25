const connection = require('../db/connection');

const fetchArticleById = article_id => {
  return connection('articles')
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .where('articles.article_id', article_id)
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article not found.' });
      } else {
        article.comment_count = +article.comment_count;
        return article;
      }
    });
};
exports.fetchArticleById = fetchArticleById;

exports.updateArticleById = (article_id, inc_votes) => {
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - `inc_votes` must be a number.'
    });
  } else {
    return connection('articles')
      .where({ article_id })
      .increment({ votes: inc_votes })
      .returning('*')
      .then(() => {
        return fetchArticleById(article_id);
      });
  }
};

exports.fetchAllArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
) => {
  return connection('articles')
    .select('articles.*')
    .count({ comment_count: 'comment_id' })
    .leftJoin('comments', 'articles.article_id', 'comments.article_id')
    .groupBy('articles.article_id')
    .orderBy(sort_by, order)
    .modify(query => {
      if (author) query.where('articles.author', author);
      if (topic) query.where('articles.topic', topic);
    })
    .then(articles => {
      articles.forEach(article => {
        article.comment_count = +article.comment_count;
      });
      return articles;
    });
};
