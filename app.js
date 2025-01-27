const express = require("express");
const apiRouter = require("./api-router");
const app = express();

app.use('/api', apiRouter)
app.use(express.json());


module.exports = app;
