const connection = require('../db/connection');

// exports.fetchArticleById = article_id => {
//   return connection('articles')
//     .select('*')
//     .where({ article_id })
//     .then(([article]) => {
//       if (article === undefined) {
//         return Promise.reject({ status: 404, msg: 'Article not found.' });
//       } else {
//         return connection('comments')
//           .select('*')
//           .where({ article_id })
//           .then(comments => {
//             article.comment_count = comments.length;
//             return article;
//           });
//       }
//     });
// };

exports.fetchArticleById = article_id => {
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
