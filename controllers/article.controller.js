const {
    selectArticleById,
    selectArticle
}= require("../models/article.model");

const getArticleById = (req, res, next) => {
    const  {id} = req.params
    selectArticleById(id)
    .then((article) =>{
        res.status(200).send({article})   
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
        console.error(err);  
        next(err); 
    });
};


module.exports = { getArticleById, getArticle };


