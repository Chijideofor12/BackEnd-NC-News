const { getAllUsers,selectUserByUsername } = require("../models/users.model.js");

const getUsers = (req, res, next) => {
  getAllUsers()
    .then((users) => {  
      res.status(200).json({ users });
    })
    .catch((err) => {
        next(err);
    });
};
const userByUsername = (req, res, next) => {
  const { username } = req.params;
  
  selectUserByUsername(username)
  .then((user) =>{
    res.status(200).send({ user })   
})
.catch((err) => {
  next(err);
});

}

module.exports = { getUsers, userByUsername };