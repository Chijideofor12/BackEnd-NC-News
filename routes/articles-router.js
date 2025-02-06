const { getArticle, getArticleById,patchArticleVotes } = require("../controllers/article.controller")
const { getCommentPerArticleId,postCommentPerArticleId } = require("../controllers/comment.controller")

const articlesRouter = require("express").Router();

articlesRouter.route("/").get(getArticle);
  articlesRouter.route("/:article_id").get(getArticleById);
  articlesRouter.route("/:article_id").patch(patchArticleVotes);
articlesRouter.route("/:article_id/comments").get(getCommentPerArticleId);
articlesRouter.route("/:article_id/comments").post(postCommentPerArticleId);
module.exports = articlesRouter;