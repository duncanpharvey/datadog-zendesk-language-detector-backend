const languageService = require("../../services/language");
const logger = require("../../services/logger");

async function detect(req, res) {
  if (!req.body.ticketId) {
    const message = "unable to update zendesk ticket with language tag, missing ticket id";
    logger.log(message);
    return res.status(400).json({ message: message });
  }

  if (!req.body.firstComment) {
    const message = `unable to detect language for zendesk ticket ${req.body.ticketId}, missing text`;
    logger.log(message);
    return res.status(400).json({ message: message });
  }

  const languages = await languageService.detect(req.body.ticketId, req.body.firstComment).catch(err => logger.log(err));;
  if (languages.length == 0) {
    const message = `no languages to tag for zendesk ticket ${req.body.ticketId}`;
    logger.log(message);
    return res.status(200).json({ message: message });
  }

  const language_tags_added = await languageService.addLanguageTag(req.body.ticketId, languages).catch(err => logger.log(err));

  if (language_tags_added) {
    const message = `updated zendesk ticket ${req.body.ticketId} with language tags for ${languages}`;
    logger.log(message);
    return res.status(200).json({ message: message });
  }
  else {
    const message = `failed to update zendesk ticket ${req.body.ticketId} with language tags for ${languages}`;
    logger.log(message);
    return res.status(400).json({ message: message });
  }
}

module.exports = {
  detect: detect
};