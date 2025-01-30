const db = require("../db/connection");

const getAllUsers = () => {
  return db.query("SELECT * FROM users")
    .then(({ rows }) => {
      return rows;
    });
};

module.exports = { getAllUsers };