const express = require("express");
const apiRouter = require("./api-router");
const {  handleServerErrors, handleNotFound } = require("./errors");
const app = express();

app.use('/api', apiRouter)
app.use(express.json());
app.all('*', handleNotFound);
app.use(handleServerErrors);


module.exports = app;
