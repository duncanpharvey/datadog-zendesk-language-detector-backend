const express = require("express");
const basicAuth = require('express-basic-auth');
const logger = require("./services/logger");

const app = express();

users = {}
users[process.env.USERNAME] = process.env.PASSWORD;

app.use(basicAuth({
  users: users,
  unauthorizedResponse: () => {
    message = "invalid credentials";
    logger.log(message);
    return { message: message };
  }
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: "language detector service is running" });
});

const routes = require("./api/routes/language");
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

const port = process.env.PORT;
app.listen(port);