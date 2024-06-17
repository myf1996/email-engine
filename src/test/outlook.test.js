const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("./../app");

chai.use(chaiHttp);
const expect = chai.expect;
describe("Outlook Tests", () => {
  // Test for OAuth Outlook Redirect
  describe("GET /api/outlook/connect", () => {
    it("should redirect to Outlook login", (done) => {
      chai
        .request(app)
        .get("/api/outlook/connect")
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200, 302]);
          expect(res.redirects).to.have.lengthOf(1); // Ensure there is exactly one redirect
          expect(res.redirects[0]).to.match(/login\.microsoftonline\.com/); // Check for the correct redirection URL
          done();
        });
    });
  });

  // Mock Test an Oauth Outlook Callback
  describe("GET /api/outlook/callback", () => {
    it("should handle OAuth callback and redirect", (done) => {
      // Expired Code
      const mockQuery = {
        code: "M.C518_BAY.2.U.43f8b21f-ecab-48ff-b417-4e16b2281613",
      };

      chai
        .request(app)
        .get("/api/outlook/callback")
        .query(mockQuery)
        .end((err, res) => {
          expect(res.status).to.be.oneOf([200, 302, 400]);
          done();
        });
    });
  });
});
