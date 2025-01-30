const endpointsJson = require("../endpoints.json")
/* Set up your test imports here */
const request = require("supertest")
const app = require("../app.js")
/* Set up your beforeEach & afterAll functions here */
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data")
require("jest-sorted");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an object containing an array of topics, each having 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body: {topics}}) => {
        topics.forEach(topic => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description")
        });

      });
  }); 
});

describe("All bad urls", () => {
  test("404: Responds with error when route does not exist", () => {
  return request(app)
    .get("/api/nonexistent")
    .expect(404)
    .then(({ body: {message} }) => {
     expect(message).toBe("Not Found");
    });
  });
})
describe("/api/articles/:article_id",()=>{
  describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object based on the given article_id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({body: {article}}) => {
        expect(article).toHaveProperty("author", "butter_bridge");
        expect(article).toHaveProperty("title", "Living in the shadow of a great man");
        expect(article).toHaveProperty("article_id", 1);
        expect(article).toHaveProperty("body", "I find this existence challenging");
        expect(article).toHaveProperty("topic", "mitch");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes", 100);
        expect(article).toHaveProperty("article_img_url", "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700");
        });

      });
      test("404: Responds with error when id is not found", () => {
        return request(app)
        .get("/api/articles/777777777")
        .expect(404)
        .then(({body}) =>{
          expect(body.msg).toBe("article not found")
        })
      })
      test("400: Responds with error when id is not a number", () => {
        return request(app)
        .get("/api/articles/not-a-number")
        .expect(400)
        .then(({body: {error}}) =>{
          expect(error).toBe("Bad Request")
        })
      })
  });describe("PATCH /api/articles/:article_id", ()=>{
    test("200: Increments votes and returns updated article", ()=>{
      return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toHaveProperty("article_id", 1);
        expect(body.article).toHaveProperty("votes", expect.any(Number));
      });
    })
    test("400: Responds with error when inc_votes is missing", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({})
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe("Bad Request");
        });
    });
    test("400: Responds with error when inc_votes is not a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "ten" })
        .expect(400)
        .then(({ body }) => {
          expect(body.error).toBe("Bad Request");
        });
    });

  test("404: Responds with error when article_id does not exist", () => {
    return request(app)
      .patch("/api/articles/9999")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("This Article is not found");
      });
  });
  test("400: Responds with error with invalid id article Id", () => {
    return request(app)
      .patch("/api/articles/not-a-number")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.error).toBe("Bad Request");
      });

  })
})
})

  describe("GET /api/articles", ()=>{
    test("200: Responds with array of articles objects ", () =>{
      return request(app)
      .get("/api/articles")
      .expect(200)
        .then(({ body: { articles } }) => { 
          expect(Array.isArray(articles)).toBe(true); 
          expect(articles.length).toBeGreaterThan(0); 
          
          const article = articles[0]; 
        expect(article).toHaveProperty("author");
        expect(article).toHaveProperty("title");
        expect(article).toHaveProperty("article_id");
        expect(article).toHaveProperty("topic");
        expect(article).toHaveProperty("created_at");
        expect(article).toHaveProperty("votes");
        expect(article).toHaveProperty("article_img_url");
        expect(article).toHaveProperty("comment_count");
        });
    })
    test("should be able to order by date in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=desc") 
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ key: "created_at", descending: true });
        });
    });
    test("400: Responds with error when sort_by is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_column&order=desc")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query");
        });
    });
  })
  describe("api/articles/:article_id/comments", () => {
    describe("GET api/articles/:article_id/comments", ()=>{
    test("200: Responds with array of comments for the given article_id ", () =>{
      return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
        .then(({ body: { comments } }) => { 
          expect(Array.isArray(comments)).toBe(true); 
          expect(comments.length).toBeGreaterThan(0); 
          
          const comment = comments[0]; 
        expect(comment).toHaveProperty("author");
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes");
        expect(comment).toHaveProperty("body");
        });

    })
    test("404: Responds with error if article_id does not exist", () => {
          return request(app)
            .get("/api/articles/999999/comments")
            .expect(404)
            .then(({ body }) => {
              expect(body.msg).toBe("Article not found");
            });
        }); 
  })
  describe("POST: api/articles/:article_id/comments", ()=>{
    test("200: Respond with posted comment", ()=>{
      return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: "lurker",
        body:"I love IceCream"
      })
      .expect(201)
      .then(({ body }) => {
        const comment = body.comment; 
        expect(comment).toHaveProperty("author", "lurker");
        expect(comment).toHaveProperty("body", "I love IceCream");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("comment_id"); 
        expect(comment).toHaveProperty("article_id", 5)
      })
    })
    test("400: Incorrect data types, Responds with error when author is a number", () => {
      return request(app)
      .post("/api/articles/5/comments")
      .send({
        username: 2,
        body:"I love IceCream"
      })
      .expect(400)
      .then(({body: {error}}) =>{
        expect(error).toBe("Bad Request")
      })
    })
    test("400: Bad request, responds with error when body is incomplete (missing username)", () => {
      return request(app)
        .post("/api/articles/5/comments")
        .send({
          body: "I love IceCream"
        })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toBe("Bad Request");
        });
    });
    test("400: Bad request, responds with error when article_id is invalid", () => {
      return request(app)
        .post("/api/articles/not-a-number/comments")
        .send({
          username: "lurker",
          body: "I love IceCream"
        })
        .expect(400)
        .then(({ body: { error } }) => {
          expect(error).toBe("Bad Request");
        });
    });
    test("404: Responds with error if article_id does not exist", () => {
      return request(app)
        .post("/api/articles/999999/comments")
        .send({
          username: "lurker",
          body: "I love IceCream"
        })
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Article Id not found");
        });
    }); 
  })
  })

describe("/api/comments", ()=>{
    describe("DELETE /api/comments/:comment_id", () => {

      test("204: Successfully deletes the comment and returns no content", () => {
        return request(app)
          .delete("/api/comments/1")
          .expect(204);
      });
    
      test("400: Invalid comment_id (not a number)", () => {
        return request(app)
          .delete("/api/comments/not-a-number")
          .expect(400)
          .then(({ body: { error } }) => {
            expect(error).toBe("Bad Request");
          });
      });
    
      test("404: Comment not found for valid but non-existent ID", () => {
        return request(app)
          .delete("/api/comments/9999")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).toBe("Comment not found");
          });
      });
    
    });
  })
  describe("/api/users",()=>{
    describe("GET /api/users", () => {
    test("200: Respond with an array of all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then(({ body }) => {
          expect(Array.isArray(body.users)).toBe(true);
          expect(body.users[0]).toHaveProperty("username");
          expect(body.users[0]).toHaveProperty("name");
          expect(body.users[0]).toHaveProperty("avatar_url");
          body.users.forEach((user) =>{
            expect(typeof user.username).toBe("string");
            expect(typeof user.name).toBe("string");
          })
          })
        });
    })
   
  })
   describe("GET /api/articles/SORT QUERIES", () => {
    test("200: Returns all articles sorted by created_at by default in descending order", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles).toBeSortedBy("created_at", { descending: true });
        });
    });
    test("200: Sorts articles by any valid column", () => {
      return request(app)
        .get("/api/articles?sort_by=title&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("title", { ascending: true });
        });
    });
    test("200: Allows sorting order to be specified (ascending)", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeSortedBy("article_id", { ascending: true });
        });
    })
    test("400: Responds with error message for invalid sort_by column", () => {
      return request(app)
        .get("/api/articles?sort_by=column_not_valid")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid sort query");
        });
    });
    test("400: Responds with error message for invalid order value", () => {
      return request(app)
        .get("/api/articles?order=order_is_invalid_")
        .expect(400)
        .then(({ body }) => {
          expect(body.msg).toBe("Invalid order query");
        });
    });
    test("200: Returns articles filtered by a valid topic", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then(({ body: { articles } }) => {
          expect(articles).toBeInstanceOf(Array);
          expect(articles.length).toBeGreaterThan(0);
          articles.forEach(article => {
            expect(article).toHaveProperty("topic", "mitch");
          });
        });
    });
    test("404: Returns error when topic does not exist", () => {
      return request(app)
        .get("/api/articles?topic=topic-does-not-exist")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("Topic not found");
        });
  });
  test("200: Returns all articles when no topic is specified", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body: { articles } }) => {
        expect(articles).toBeInstanceOf(Array);
        expect(articles.length).toBeGreaterThan(0);
      });
  });
});

  
  
  


