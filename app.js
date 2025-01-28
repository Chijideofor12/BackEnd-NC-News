const express = require("express");
const {
  handleServerErrors,
  handleNotFound,
  handleCustomErrors,
} = require("./errors");
const getTopics = require("./controllers/topics.controller");
const getApiDocs = require("./controllers/api_docs.controller");
const getArticleById = require("./controllers/article.controller");
const app = express();

app.get("/api", getApiDocs);
app.get("/api/topics", getTopics);
app.get("/api/articles/:id", getArticleById);

app.all("*", handleNotFound);

//error handling middleware

app.use((err, req, res, next) => {
    if (err.code === "22P02" ) {
      res.status(400).send({ error: "Bad Request" });
    } else {
       
      next(err); 
    }
  });

app.use((err, req, res, next) => {
  if (err.message === "article not found") {
    res.status(404).send({ message: "Not found" });
  } else {
    next(err);
  }
});
//app.use(handleCustomErrors)
app.use(handleServerErrors);

module.exports = app;
