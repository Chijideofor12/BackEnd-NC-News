const db = require("../db/connection.js");

const selectArticleById = (article_id) => {
  const SQLString = `
     SELECT 
          articles.article_id, 
          articles.title, 
          articles.body,  -- Include the 'body' field
          articles.topic, 
          articles.author, 
          articles.created_at, 
          articles.votes, 
          articles.article_img_url,
          COUNT(comments.comment_id) AS comment_count
      FROM 
          articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
      WHERE articles.article_id = $1
      GROUP BY 
          articles.article_id;
  `;

  return db.query(SQLString, [article_id])
      .then(({ rows }) => {
          if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "Article not found" });
          }
          return rows[0];
      });
};

const selectArticle = (queries) => {
  const sort_by = queries.sort_by || "created_at"; 
  const order = queries.order || "desc"; 
  const topic = queries.topic;

  const validColumnNamesToSortBy = ["article_id", "title", "topic", "author", "created_at", "votes", "article_img_url"];
  const validOrders = ["asc", "desc"];

  if (!validColumnNamesToSortBy.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!validOrders.includes(order)) {
      return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let SQLString = `
      SELECT 
          articles.article_id,          
          articles.title,
          articles.topic,
          articles.author,
          articles.created_at,
          articles.votes,
          articles.article_img_url,
          COUNT(comments.comment_id) AS comment_count
      FROM 
          articles
      LEFT JOIN comments ON articles.article_id = comments.article_id`;

  const queryValues = [];

  if (topic) {
      return db.query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
          .then(({ rows }) => {
              if (rows.length === 0) {
                  return Promise.reject({ status: 404, msg: "Topic not found" });
              }

              SQLString += ` WHERE articles.topic = $1`;
              queryValues.push(topic);

              SQLString += ` 
                  GROUP BY 
                      articles.article_id,          
                      articles.title, 
                      articles.topic,
                      articles.author,
                      articles.created_at,
                      articles.votes,
                      articles.article_img_url          
                  ORDER BY ${sort_by} ${order};`;

              return db.query(SQLString, queryValues).then(({ rows }) => rows);
          });
  }

  SQLString += ` 
      GROUP BY 
          articles.article_id,          
          articles.title, 
          articles.topic,
          articles.author,
          articles.created_at,
          articles.votes,
          articles.article_img_url          
      ORDER BY ${sort_by} ${order};`;

  return db.query(SQLString).then(({ rows }) => rows);
};


const updateArticleVotes = (article_id, inc_votes) => {
    if (typeof inc_votes !== "number") {
      return Promise.reject({ status: 400, msg: "Invalid data type" });
    }
   
    return db.query("SELECT * FROM articles WHERE article_id = $1", [article_id])
          .then(({ rows }) => {
            if (rows.length === 0) {
              return Promise.reject({ status: 404, msg: "This Article is not found" });
            }
            if (isNaN(article_id)) {
                return Promise.reject({ status: 400, msg: "Bad Request" });
              }
        
   const queryStr = 
        `UPDATE articles 
         SET votes = votes + $1 
         WHERE article_id = $2 
         RETURNING *;`
        
      return db.query(queryStr, [inc_votes, article_id] )
      .then(({ rows }) => {
        return rows[0];
      });
    })
  };
  



module.exports = { selectArticleById, selectArticle, updateArticleVotes };
