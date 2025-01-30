const express = require("express");
const {
  handleServerErrors,
  handleNotFound,
  handleCustomErrors,
} = require("./errors");
const getTopics = require("./controllers/topics.controller");
const getApiDocs = require("./controllers/api_docs.controller");
const {
  getArticleById,
  getArticle,
  patchArticleVotes
} = require("./controllers/article.controller");
const {
    getCommentPerArticleId,
    postCommentPerArticleId
} = require("./controllers/comment.controller");

const app = express();

app.use(express.json());

app.get("/api", getApiDocs);
app.get("/api/topics", getTopics);
app.get("/api/articles/:id", getArticleById);
app.get("/api/articles", getArticle);
app.get("/api/articles/:article_id/comments", getCommentPerArticleId);
app.post("/api/articles/:article_id/comments", postCommentPerArticleId);
app.patch("/api/articles/:article_id", patchArticleVotes);



app.all("*", handleNotFound);

//error handling middleware

app.use((err, req, res, next) => {
  if (err.code === "22P02" ||  err.msg === "Invalid data type" || err.msg === "Missing required fields") {
   return  res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
