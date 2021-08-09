const languageService = require("../../services/language");
const logger = require('../../services/logger');

async function detect(req, res) {
  if (!req.body.ticketId) {
    const message = "unable to update Zendesk ticket with language tag, missing ticket id";
    logger.warn(message);
    return res.status(400).json({ message: message });
  }

  if (!req.body.firstComment) {
    const message = `unable to detect language for Zendesk ticket ${req.body.ticketId}, missing text`;
    logger.warn(message, { ticketId: req.body.ticketId });
    return res.status(400).json({ message: message });
  }

  const languages = await languageService.detect(req.body.firstComment);

  for (const language of languages) {
    await languageService.addLanguageTag(req.body.ticketId, language);
  }

  const response = { ticketId: req.body.ticketId, languages: languages };
  logger.info(`updated Zendesk ticket ${req.body.ticketId} with language tags for ${languages}`, response)
  return res.status(200).json(response);
}

module.exports = {
  detect: detect
};