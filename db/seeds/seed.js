const {
  topicData,
  articleData,
  commentData,
  userData
} = require('../data/index');

const { formatDates, formatComments, makeRefObj } = require('../utils/utils');

exports.seed = connection => {
  return connection.migrate
    .rollback()
    .then(() => connection.migrate.latest())
    .then(() => connection('topics').insert(topicData))
    .then(() => connection('users').insert(userData))
    .then(() => {
      const formattedArticles = formatDates(articleData);
      return connection('articles').insert(formattedArticles, '*');
    })
    .then(insertedArticles => {
      const articleRef = makeRefObj(insertedArticles);
      const formattedComments = formatComments(commentData, articleRef);
      return connection('comments').insert(formattedComments);
    });
};
