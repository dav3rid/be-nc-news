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

exports.updateArticleById = (article_id, inc_votes = 0) => {
  return connection('articles')
    .where({ article_id })
    .increment({ votes: inc_votes })
    .returning('*')
    .then(() => {
      return fetchArticleById(article_id);
    });
};

// DATABASE EXISTENCE CHECKERS FOR fetchAllArticles

const checkIfAuthorExists = username => {
  if (!username) return Promise.resolve();
  return connection('users')
    .select('*')
    .where({ username })
    .then(([user]) => {
      if (!user) {
        return Promise.reject({ status: 404, msg: 'Author not found.' });
      }
    });
};
const checkIfTopicExists = slug => {
  if (!slug) return Promise.resolve();
  return connection('topics')
    .select('*')
    .where({ slug })
    .then(([topic]) => {
      if (!topic) {
        return Promise.reject({ status: 404, msg: 'Topic not found.' });
      }
    });
};

exports.fetchAllArticles = (
  sort_by = 'created_at',
  order = 'desc',
  author,
  topic
) => {
  const fetchPromise = () => {
    return connection('articles')
      .select('articles.*')
      .count({ comment_count: 'comment_id' })
      .leftJoin('comments', 'articles.article_id', 'comments.article_id')
      .groupBy('articles.article_id')
      .orderBy(sort_by, order)
      .modify(query => {
        if (author) query.where('articles.author', author);
        if (topic) query.where('articles.topic', topic);
      });
  };

  return Promise.all([
    fetchPromise(),
    checkIfAuthorExists(author),
    checkIfTopicExists(topic)
  ]).then(([articles]) => {
    articles.forEach(article => {
      article.comment_count = +article.comment_count;
    });
    return articles;
  });
};

exports.addArticle = articleObj => {
  return connection('articles').insert(articleObj, '*');
};
