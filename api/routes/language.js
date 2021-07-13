const language = require("../controllers/language");

module.exports = function (app) {
  app.route("/language").post(language.detect);
};