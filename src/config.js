const dotenv = require("dotenv");
dotenv.config();

const config = {
  port: 3000,
  baseurl: "api",
  outlook: {
    authorizeUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/authorize`,
    tokenUrl: `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    secretKey: process.env.SECRET_KEY,
    redirectUrl: process.env.REDIRECT_URI,
    graphUrl: 'https://graph.microsoft.com/v1.0',
    webhookUrl: process.env.WEBHOOK_URL
  },
  elasticsearch: {
    baseUrl: process.env.ELASTICSEARCH_URL,
  },
};

module.exports = config;
