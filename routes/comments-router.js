const express = require("express");
const {
  getComments,
  removeComment,
  updateVoteComment,
} = require("../controllers/comment.controller");

const commentsRouter = express.Router();

commentsRouter.route("/").get(getComments);
commentsRouter.route("/:comment_id").delete(removeComment);

commentsRouter.route("/:comment_id").patch(updateVoteComment);

module.exports = commentsRouter;
