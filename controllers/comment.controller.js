const { 
    selectCommentPerArticleId, 
    addComment
}= require("../models/comment.model");

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
  const postCommentPerArticleId = (req, res, next)=>{
    const { article_id } = req.params; 
    const { username, body } = req.body;

    addComment(article_id, username, body)
    .then((comment) => {
      res.status(201).json({ comment });
    })
    .catch((err) => { 
      next(err); 
    });
  }
  

module.exports = { getCommentPerArticleId, postCommentPerArticleId }