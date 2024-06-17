const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./../app");

chai.use(chaiHttp);
const expect = chai.expect;
describe("ElasticSearch Tests", () => {
  // Test for Elasaticsearch connection with applicationn
  describe("GET /api/elasticsearch/ping", () => {
    it("should response elasticsearch status", (done) => {
      chai
        .request(app)
        .get("/api/elasticsearch/ping")
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200]);
          expect(res.body).to.have.property(
            "message",
            "Elasticsearch cluster is up!"
          );
          done();
        });
    });
  });
});
