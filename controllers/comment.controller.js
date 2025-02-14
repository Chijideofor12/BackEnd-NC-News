const {
  selectCommentPerArticleId,
  addComment,
  deleteCommentById,
  selectComments,
  patchCommentVote,
} = require("../models/comment.model");

const getComments = (req, res, next) => {
  selectComments()
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentPerArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentPerArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};
const postCommentPerArticleId = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;
  addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).json({ comment });
    })
    .catch((err) => {
      next(err);
    });
};
const removeComment = (req, res, next) => {
  const { comment_id } = req.params;
  deleteCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

const updateVoteComment = (req, res, next) => {
  const { comment_id } = req.params;
  const { inc_votes } = req.body;
  patchCommentVote(comment_id, inc_votes)
    .then((comment) => {
      res.status(200).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getCommentPerArticleId,
  postCommentPerArticleId,
  removeComment,
  getComments,
  updateVoteComment,
};
