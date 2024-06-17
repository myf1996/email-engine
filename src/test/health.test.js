const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./../app");

chai.use(chaiHttp);
const expect = chai.expect;
describe("Health Tests", () => {
  // Test for Application Health
  describe("GET /api/health", () => {
    it("should be healthy all time", (done) => {
      chai
        .request(app)
        .get("/api/health")
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200]);
          expect(res.body).to.have.property(
            "message",
            "Innoscripta is healthy."
          );
          done();
        });
    });
  });
});
