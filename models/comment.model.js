const db = require("../db/connection.js");

const selectCommentPerArticleId = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1;`, [article_id]) // Check if the article exists first
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Article not found" });
      }
      return db.query(
        `SELECT comment_id, votes, created_at, author, body, article_id 
         FROM comments WHERE article_id = $1
         ORDER BY created_at DESC;`,
        [article_id]
      );
    })
    .then(({ rows }) => {
      return rows; 
    });
};

const addComment = (article_id, username, body) => {

  if (!username || !body) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
    if (typeof username !== "string" || typeof body !== "string") {
      const error = { status: 400, msg: "Invalid data type" };
      return Promise.reject(error);  
    }
  
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Article Id not found" });
        }

        if (isNaN(article_id)) {
          return Promise.reject({ status: 400, msg: "Bad Request" });
        }
  
        return db.query("SELECT * FROM users WHERE username = $1", [username])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "User not found" });
            }
  
            const queryStr = `
              INSERT INTO comments (article_id, author, body)
              VALUES ($1, $2, $3)
              RETURNING comment_id, author, body, article_id, created_at;
            `;
  
            return db.query(queryStr, [article_id, username, body])
              .then(({ rows }) => {
                return rows[0];
              });
          });
      });
  };

  const deleteCommentById = (comment_id) => {
    if (isNaN(comment_id)) {
      return Promise.reject({ status: 400, msg: "Invalid comment ID" });
    }
  
    return db.query("DELETE FROM comments WHERE comment_id = $1 RETURNING *;", [comment_id])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Comment not found" });
        }
        return;
      });
  };
  
  
  module.exports = { selectCommentPerArticleId, addComment, deleteCommentById }
  


