const db = require("../db/connection");

const getAllUsers = () => {
  return db.query("SELECT * FROM users")
    .then(({ rows }) => {
      return rows;
    });
};
const selectUserByUsername = (username) =>{
  const SQLString = `
  SELECT 
  *
  FROM
    users
     WHERE username = $1;
  `;
  return db.query(SQLString, [username])
  .then(({ rows }) => {
    if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Username not found" });
    }
    return rows[0];
});
}

module.exports = { getAllUsers, selectUserByUsername };