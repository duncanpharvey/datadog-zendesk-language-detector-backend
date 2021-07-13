const express = require("express");

const app = express();

app.use(express.json());

const routes = require("./api/routes/language");
routes(app);

app.use(function (req, res) {
  res.status(404).send({ url: `${req.originalUrl} not found` });
});

const port = process.env.PORT || 9000;
app.listen(port);