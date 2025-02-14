exports.handleCustomErrors = (err, req, res, next) => {
  if (err.code === "23503") {
    if (err.detail && err.detail.includes("users")) {
      res.status(404).json({ msg: "Author not found" });
    } else if (err.detail && err.detail.includes("topics")) {
      res.status(404).json({ msg: "Topic not found" });
    } else {
      res.status(404).json({ msg: "Foreign key violation" });
    }
  } else if (err.status) {
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
