const {
  selectArticleById,
  selectArticle,
  updateArticleVotes,
  postArticle,
  deleteArticleById,
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
    .then((result) => {
      res.status(200).send(result);
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

const removeArticleById = (req, res, next) => {
  const { article_id } = req.params;
  deleteArticleById(article_id)
    .then((article) => {
      res.status(204).send({ article });
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
  removeArticleById,
};
