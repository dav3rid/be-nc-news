const {
  addComment,
  fetchCommentsByArticleId,
  updateCommentById,
  removeCommentById
} = require('../models/comments');

exports.postComment = (req, res, next) => {
  const commentObj = req.body;
  commentObj.author = commentObj.username;
  commentObj.article_id = req.params.article_id;
  delete commentObj.username;
  addComment(commentObj)
    .then(([insertedComment]) => {
      res.status(201).send({ comment: insertedComment });
    })
    .catch(err => {
      if (!err.msg) {
        err.msg = 'Unprocessable entity - article does not exist.';
      }
      next(err);
    });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { sort_by } = req.query;
  const { order } = req.query;
  fetchCommentsByArticleId(article_id, sort_by, order)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(err => {
      if (!err.msg) {
        err.msg = 'Bad request - invalid query.';
      }
      next(err);
    });
};

exports.patchCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  updateCommentById(comment_id, inc_votes)
    .then(updatedComment => {
      res.status(200).send({ comment: updatedComment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
};
