const selectArticleById = require("../models/article.model");

const getArticleById = (req, res, next) => {
    const  {id} = req.params
    selectArticleById(id)
    .then((article) =>{
        res.status(200).send({article})   
    })
    .catch((err) => {
        console.log(err, "this err");
        
        next(err);
    });
    

};

module.exports = getArticleById;