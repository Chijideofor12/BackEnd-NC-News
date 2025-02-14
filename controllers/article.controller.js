const {
  selectArticleById,
  selectArticle,
  updateArticleVotes,
  postArticle,
} = require("../models/article.model");

const getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getArticle = (req, res, next) => {
  const queries = req.query;
  selectArticle(queries)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const patchArticleVotes = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateArticleVotes(article_id, inc_votes)
    .then((updatedArticle) => {
      res.status(200).json({ article: updatedArticle });
    })
    .catch((err) => {
      next(err);
    });
};

const addNewArticle = (req, res, next) => {
  const newArticle = req.body;

  postArticle(newArticle)
    .then((article) => {
      res.status(201).json({ article });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getArticleById,
  getArticle,
  patchArticleVotes,
  addNewArticle,
};
