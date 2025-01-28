exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.message) {
    console.log(err.msg, "mmmmmm");
    
    // Respond with the error status and a message property
    res.status(err.status).send({ message: err.message });
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
