const connection = require('../db/connection');

exports.addComment = commentObj => {
  if (isNaN(+commentObj.article_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - `article_id` must be a number.'
    });
  } else if (!commentObj.body || !commentObj.author) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - input must have keys `username` and `body`.'
    });
  } else if (
    typeof commentObj.body !== 'string' ||
    typeof commentObj.author !== 'string'
  ) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - input values must be strings.'
    });
  } else {
    return connection('comments').insert(commentObj, '*');
  }
};

exports.fetchCommentsByArticleId = (
  article_id,
  sort_by = 'created_at',
  order = 'desc'
) => {
  if (isNaN(+article_id)) {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - `article_id` must be a number.'
    });
  } else {
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
          .orderBy(sort_by, order)
          .then(comments => {
            if (comments.length < 1) {
              return Promise.reject({ status: 404, msg: 'Article not found.' });
            } else {
              return comments;
            }
          });
      });
  }
};

exports.updateCommentById = (comment_id, inc_votes) => {
  if (typeof inc_votes !== 'number') {
    return Promise.reject({
      status: 400,
      msg: 'Bad request - `inc_votes` must be a number.'
    });
  } else {
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
  }
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
