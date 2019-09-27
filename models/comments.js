const connection = require('../db/connection');

exports.addComment = commentObj => {
  return connection('comments').insert(commentObj, '*');
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  return connection('articles')
    .select('*')
    .where({ article_id })
    .then(([article]) => {
      if (!article) {
        return Promise.reject({ status: 404, msg: 'Article not found.' });
      }
    })
    .then(() => {
      return connection('comments')
        .select('*')
        .where({ article_id })
        .orderBy(sort_by, order);
    });
};

exports.updateCommentById = (comment_id, inc_votes = 0) => {
  return connection('comments')
    .where({ comment_id })
    .increment({ votes: inc_votes })
    .returning('*')
    .then(([comment]) => {
      if (!comment) {
        return Promise.reject({ status: 404, msg: 'Comment not found.' });
      } else {
        return comment;
      }
    });
};

exports.removeCommentById = comment_id => {
  return connection('comments')
    .where({ comment_id })
    .del()
    .returning('*')
    .then(([deletedComment]) => {
      if (!deletedComment) {
        return Promise.reject({ status: 404, msg: 'Comment not found.' });
      }
    });
};
