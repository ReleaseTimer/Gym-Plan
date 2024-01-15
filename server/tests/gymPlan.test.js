const request = require("supertest");
const app = require("../server");
const expect = require("chai").expect;

describe("Gym Plan API Tests", function () {
  let planID;

  // Test for CreateGymPlan Endpoint
  describe("Gym Plan API Tests", function () {
    it("should create a new gym plan", function (done) {
      request(app)
        .post("/create-gymplan")
        .send({
          userID: "123",
          planName: "Plan A",
          exercises: [{ name: "Push-up", duration: 30 }],
        })
        .expect(201)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property("message", "Exercise Plan Created");
          done();
        });
    });
  });

  // Test for CreateGymPlan Endpoint
  describe("Gym Plan API Tests", function () {
    it("should fail to create a new gym plan", function (done) {
      request(app)
        .post("/create-gymplan")
        .send({
          userID: "123",
        })
        .expect(422)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property("message", "Missing Feilds");
          done();
        });
    });
  });

  // Test for GetGymplan Endpoint
  describe("GET /get-gymplan", function () {
    it("should retrieve gym plans", function (done) {
      request(app)
        .get("/get-gymplan?userID=123")
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);

          done();
        });
    });
  });

  // Test for GetGymplan Endpoint
  describe("GET /get-gymplan", function () {
    it("should fail to retrieve gym plans", function (done) {
      request(app)
        .get("/get-gymplan?userID=TESTERFAIL")
        .expect(404)
        .end(function (err, res) {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "message",
            "No gym plans found for this email"
          );
          done();
        });
    });
  });
});
