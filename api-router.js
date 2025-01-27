const apiRouter = require("express").Router();
const  getApiDocs  = require("./controllers/api_docs.controller");

apiRouter.get('/', getApiDocs);

module.exports = apiRouter;
