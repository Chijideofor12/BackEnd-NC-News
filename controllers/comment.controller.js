const selectCommentPerArticleId = require("../models/comment.model");

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
  

  

module.exports = getCommentPerArticleId;