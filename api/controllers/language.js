const languageService = require("../../services/language");
const logger = require('../../services/logger');

async function detect(req, res) {
  if (!req.body.ticketId) {
    const message = "unable to update Zendesk ticket with language tag, missing ticket id";
    logger.error(message);
    return res.status(400).json({ message: message });
  }

  if (!req.body.firstComment) {
    const message = `unable to detect language for Zendesk ticket ${req.body.ticketId}, missing text`;
    logger.error(message, { ticketId: req.body.ticketId });
    return res.status(400).json({ message: message });
  }

  const languages = await languageService.detect(req.body.firstComment);
  if (languages.length == 0) {
    const message = `no languages to tag for Zendesk ticket ${req.body.ticketId}`;
    logger.info(message, { ticketId: req.body.ticketId });
    return res.status(200).json({ message: message });
  }

  const language_tags_added = await languageService.addLanguageTag(req.body.ticketId, languages);

  const response = { ticketId: req.body.ticketId, languages: languages };
  if (language_tags_added) {
    logger.info(`updated Zendesk ticket ${req.body.ticketId} with language tags for ${languages}`, response)
    return res.status(200).json(response);
  }
  else {
    const message = `failed to update Zendesk ticket ${req.body.ticketId} with language tags for ${languages}`;
    logger.error(message, response)
    return res.status(400).json({ message: message });
  }
}

module.exports = {
  detect: detect
};