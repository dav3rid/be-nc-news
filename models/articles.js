const connection = require('../db/connection');

exports.fetchArticleById = article_id => {
  return connection('articles')
    .select('*')
    .where({ article_id })
    .then(([article]) => {
      if (article === undefined) {
        return Promise.reject({ status: 404, msg: 'Article not found.' });
      } else {
        return connection('comments')
          .select('*')
          .where({ article_id })
          .then(comments => {
            article.comment_count = comments.length;
            return article;
          });
      }
    });
};

exports.updateArticleById = (article_id, inc_votes) => {
  return connection('articles')
    .select('votes')
    .where({ article_id })
    .then(([{ votes }]) => {
      const updatedVotes = (votes += inc_votes);
      return connection('articles')
        .update({ votes: updatedVotes }, '*')
        .where({ article_id });
    })
    .then(([updatedArticle]) => {
      return updatedArticle;
    });
};
