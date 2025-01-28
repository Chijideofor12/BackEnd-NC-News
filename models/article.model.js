const db = require("../db/connection.js");
const selectArticleById = (id) => {
  return db
    .query(
      `
        SELECT * FROM articles 
        WHERE article_id = $1 
        `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ message: "article not found" });
      } else {
        return rows[0];
      }
    });
};
module.exports = selectArticleById;
