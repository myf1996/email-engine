const express = require("express");
const cors = require("cors");
const openapi = require("express-openapi");
const bodyParser = require("body-parser");
const contract = require("../swagger");
const dotenv = require("dotenv");
const config = require("./config");
const path = require("path");
const session = require("express-session");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
dotenv.config();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.json());
app.use(
  session({
    secret: config.outlook.secretKey,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/index", async (req, res) => {
  if (req.session.userId) {
    res.render("index", { user: true });
  } else {
    res.render("index", { user: null });
  }
});

// Initialize OpenAPI
openapi.initialize({
  apiDoc: contract,
  app,
  consumesMiddleware: {
    "application/json": bodyParser.json(),
  },
  dependencies: {},
  errorMiddleware: (err, req, res, next) => {
    let errMsg;
    try {
      errMsg = JSON.parse(err.message);
      errMsg = errMsg?.message ? errMsg.message : err.message;
    } catch (e) {
      errMsg = err.message;
    }
    res.status(err.status || 500).send({
      message: errMsg,
      errors: err.errors,
    });
  },
  docsPath: "/swagger",
  enableObjectCoercion: true,
  paths: "src/controllers",
  promiseMode: true,
  validateApiDoc: true,
});

// General Error Handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;
