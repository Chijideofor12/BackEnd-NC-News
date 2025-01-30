exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status).json({ msg: err.msg });
  } else {
    next(err);
  }
};

  
exports.handleServerErrors = (err, req, res, next) => {
  console.log(err, "<<<< you havent handled this error yet");
  res.status(500).send({ msg: "Internal Server Error" });
};
exports.handleNotFound = (req, res) => {
  res.status(404).send({ message: "Not Found" });
};
