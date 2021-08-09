const languageService = require("../../services/language");

async function detect(req, res) {
  // console.log(req.body);

  if (!req.body.firstComment) {
    return res.status(400).json({ message: "no text to parse" });
  }

  if (!req.body.ticketId) {
    return res.status(400).json({ message: "no ticket to update with language tag" });
  }

  const languages = await languageService.detect(req.body.firstComment);

  for (const language of languages) {
    console.log(language);
    await languageService.addLanguageTag(req.body.ticketId, language);
  }

  return res.status(200).json({ ticketId: req.body.ticketId, languages: languages });
}

module.exports = {
  detect: detect
};