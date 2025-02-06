const express = require("express");
const { getComments,removeComment } = require("../controllers/comment.controller");

const commentsRouter = express.Router();
commentsRouter.route("/").get(getComments)
commentsRouter.route("/:comment_id").delete(removeComment);

module.exports = commentsRouter;
