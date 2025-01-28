const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const request = require("supertest");
const app = require("../app")
/* Set up your beforeEach & afterAll functions here */

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
        expect(endpoints["GET /api"].description).toBeDefined();
        expect(endpoints["GET /api"].description).toBe(
          "serves up a json representation of all the available endpoints of the api"
        );

      });
  });
});


describe("GET /api/topics", () => {
  test("200: Responds with an object containing an array of topics, each having 'slug' and 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body}) => {
        console.log({body});
        expect(body.topics).toHaveProperty("GET /api/topics");
        body.topics["GET /api/topics"].exampleResponse.topics.forEach(topic => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description")
        });

      });
  });
  test.only("404: Responds with error when route does not exist", () => {
    return request(app)
      .get("/api/nonexistent")
      .expect(404)
      .then(({ body }) => {
        console.log({body});
        
        expect(body.message).toBe("Not Found");
      });
    });
});
