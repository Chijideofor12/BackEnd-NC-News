const apiRouter = require("express").Router();
const  getApiDocs  = require("./controllers/api_docs.controller");
const topicsRouter = require("./topics-router");

apiRouter.use('/topics', topicsRouter);
apiRouter.get('/', getApiDocs);

module.exports = apiRouter;
