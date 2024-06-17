const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./../app");

chai.use(chaiHttp);
const expect = chai.expect;
describe("Email Tests", () => {
  // Test for Sync Email
  describe("GET /api/email", () => {
    it("fetch latest emails of user", (done) => {
      chai
        .request(app)
        .get("/api/email")
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200, 400]);
          done();
        });
    });
  });
});
