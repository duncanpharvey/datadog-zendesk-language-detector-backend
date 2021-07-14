const languageService = require("../../services/language");
const zendeskService = require("../../services/zendesk");

function detect(req, res) {
  console.log(req.body);
  const language = languageService.detect(req.body.firstComment);
  console.log(language);

  // only add language tags for japanese, chinese, and korean
  if (["japanese", "chinese", "korean"].includes(language)) {
    zendeskService.addLanguageTag(req.body.ticketId, req.body.tags, language);
  }

  res.json({ ticketId: req.body.ticketId, language: language });
}

module.exports = {
  detect: detect
};