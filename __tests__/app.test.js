const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app.js")
/* Set up your beforeEach & afterAll functions here */
const db = require("../db/connection.js")
const seed = require("../db/seeds/seed.js")
const testData = require("../db/data/test-data")

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
        .then(({body: {message}}) =>{
          expect(message).toBe("Not found")
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
  });


