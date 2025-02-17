const express = require("express");
const {
  handleServerErrors,
  handleNotFound,
  handleCustomErrors,
} = require("./errors");
const app = express();
const cors = require("cors");
app.use(cors());

const apiRouter = require("./routes/api-router");

app.use(express.json());
app.use("/api", apiRouter);
app.all("*", handleNotFound);

//error handling middleware

app.use((err, req, res, next) => {
  if (
    err.code === "22P02" ||
    err.msg === "Invalid data type" ||
    err.msg === "Missing required fields" ||
    err.msg === "Invalid comment ID"
  ) {
    return res.status(400).send({ error: "Bad Request" });
  } else {
    next(err);
  }
});

app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
