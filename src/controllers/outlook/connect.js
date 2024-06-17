const config = require("../../config");

module.exports = () => ({
  get: async (req, res) => {
    const scope = "openid profile offline_access email Mail.Read User.Read";
    const params = new URLSearchParams({
      client_id: config.outlook.clientId,
      response_type: "code",
      redirect_uri: config.outlook.redirectUrl,
      response_mode: "query",
      scope: scope,
    });
    const authorizeUrl = `${config.outlook.authorizeUrl}?${params.toString()}`;
    res.redirect(authorizeUrl);
  },
});
