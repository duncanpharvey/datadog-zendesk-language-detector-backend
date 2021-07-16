const languageService = require("../../services/language");
const zendeskService = require("../../services/zendesk");

async function detect(req, res) {
  console.log(req.body);
  const languages = await languageService.detect(req.body.firstComment);

  for (const language of languages) {
    await zendeskService.addLanguageTag(req.body.ticketId, language);
  }

  res.json({ ticketId: req.body.ticketId, languages: languages });
}

module.exports = {
  detect: detect
};