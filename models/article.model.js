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

  return db.query(SQLString, [article_id]).then(({ rows }) => {
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

  // Pagination defaults
  const limit = queries.limit ? parseInt(queries.limit, 10) : 5;
  const p = queries.p ? parseInt(queries.p, 10) : 1;

  if (queries.limit && isNaN(limit)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: limit must be a number",
    });
  }
  if (queries.p && isNaN(p)) {
    return Promise.reject({
      status: 400,
      msg: "Bad request: p must be a number",
    });
  }
  const offset = (p - 1) * limit;

  const validColumnNamesToSortBy = [
    "article_id",
    "title",
    "topic",
    "author",
    "created_at",
    "votes",
    "article_img_url",
  ];
  const validOrders = ["asc", "desc"];

  if (!validColumnNamesToSortBy.includes(sort_by)) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }
  if (!validOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  let countSQL = `SELECT COUNT(*)::int AS total_count FROM articles`;
  let countValues = [];

  let mainQuery = `
      SELECT 
        articles.article_id,          
        articles.title,
        articles.topic,
        articles.author,
        articles.created_at,
        articles.votes,
        articles.article_img_url,
        COUNT(comments.comment_id)::INT AS comment_count
      FROM 
        articles
      LEFT JOIN comments ON articles.article_id = comments.article_id
    `;
  const queryValues = [];

  if (topic) {
    return db
      .query(`SELECT * FROM topics WHERE slug = $1;`, [topic])
      .then(({ rows }) => {
        if (rows.length === 0) {
          return Promise.reject({ status: 404, msg: "Topic not found" });
        }

        countSQL += ` WHERE topic = $1`;
        countValues.push(topic);
        mainQuery += ` WHERE articles.topic = $1`;
        queryValues.push(topic);

        mainQuery += `
            GROUP BY 
              articles.article_id,          
              articles.title, 
              articles.topic,
              articles.author,
              articles.created_at,
              articles.votes,
              articles.article_img_url
            ORDER BY ${sort_by} ${order}
            LIMIT $${queryValues.length + 1} OFFSET $${queryValues.length + 2};
          `;
        queryValues.push(limit, offset);

        return db.query(countSQL, countValues).then(({ rows: countRows }) => {
          const total_count = countRows[0].total_count;
          return db.query(mainQuery, queryValues).then(({ rows }) => {
            return { total_count, articles: rows };
          });
        });
      });
  } else {
    mainQuery += `
        GROUP BY 
          articles.article_id,          
          articles.title, 
          articles.topic,
          articles.author,
          articles.created_at,
          articles.votes,
          articles.article_img_url
        ORDER BY ${sort_by} ${order}
        LIMIT $1 OFFSET $2;
      `;
    queryValues.push(limit, offset);

    return db.query(countSQL, countValues).then(({ rows: countRows }) => {
      const total_count = countRows[0].total_count;
      return db.query(mainQuery, queryValues).then(({ rows }) => {
        return { total_count, articles: rows };
      });
    });
  }
};

const updateArticleVotes = (article_id, inc_votes) => {
  if (typeof inc_votes !== "number") {
    return Promise.reject({ status: 400, msg: "Invalid data type" });
  }

  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "This Article is not found",
        });
      }
      if (isNaN(article_id)) {
        return Promise.reject({ status: 400, msg: "Bad Request" });
      }

      const queryStr = `UPDATE articles 
         SET votes = votes + $1 
         WHERE article_id = $2 
         RETURNING *;`;

      return db.query(queryStr, [inc_votes, article_id]).then(({ rows }) => {
        return rows[0];
      });
    });
};

const postArticle = (newArticle) => {
  const { title, body, topic, author, article_img_url } = newArticle;

  if (!title || !body || !topic || !author) {
    return Promise.reject({ status: 400, msg: "Missing required fields" });
  }
  const defaultArticleImgUrl = "https://default.image.url/default.jpg";

  const articleImgUrlToUse = article_img_url || defaultArticleImgUrl;

  return db
    .query(
      `INSERT INTO articles (title, body, topic, author, article_img_url) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING article_id;`,
      [title, body, topic, author, articleImgUrlToUse]
    )
    .then(({ rows }) => {
      const articleId = rows[0].article_id;
      const queryStr = `
          SELECT 
            articles.article_id,          
            articles.title,
            articles.topic,
            articles.author,
            articles.created_at,
            articles.votes,
            articles.body,
            articles.article_img_url,
            COUNT(comments.comment_id)::INT AS comment_count
          FROM 
            articles
          LEFT JOIN comments 
            ON articles.article_id = comments.article_id
          WHERE articles.article_id = $1
          GROUP BY 
            articles.article_id, 
            articles.title, 
            articles.topic, 
            articles.author, 
            articles.body,
            articles.created_at, 
            articles.votes, 
            articles.article_img_url;
        `;
      return db.query(queryStr, [articleId]);
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

module.exports = {
  selectArticleById,
  selectArticle,
  updateArticleVotes,
  postArticle,
};
