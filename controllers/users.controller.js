const { getAllUsers } = require("../models/users.model.js");

const getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {  
      res.status(200).json({ users });
    })
    .catch((err) => {
        next(err);
    });
};

module.exports = { getUsers };