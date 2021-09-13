const cld = require('cld');
const axios = require('axios');
const logger = require("./logger");

function filter(languages) {
    return languages.map(language => language == "chineset" ? "chinese" : language).filter(language => process.env.LANGUAGES_TO_TAG.split(',').includes(language));
}

async function detect(ticketId, text) {
    if (!text) {
        logger.log(`unable to detect language for zendesk ticket ${ticketId}, missing text`);
        return [];
    }
    const result = await cld.detect(text);
    logger.log(`languages detected for zendesk ticket ${ticketId}: ${JSON.stringify(result.languages)}`);
    const languages = result.languages.map(lang => lang.name.toLowerCase()); // save all languages for now, could use probability to filter further
    return filter(languages);
}

async function addLanguageTag(ticketId, languages) {
    if (!ticketId) {
        logger.log("unable to update zendesk ticket with language tag, missing ticket id");
        return false;
    }
    if (!languages || languages.length == 0) {
        logger.log(`unable to update zendesk ticket ${ticketId} with language tag, missing language`);
        return false;
    }
    const language_tags = languages.map(language => `${language}_language`);
    var success;
    await axios({
        method: "put",
        url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticketId}/tags`,
        auth: {
            username: process.env.ZENDESK_USERNAME,
            password: process.env.ZENDESK_API_TOKEN,
        },
        data: {
            "tags": language_tags
        }
    }).then(() => { success = true; }).catch(() => { success = false; });
    return success;
}

module.exports = {
    addLanguageTag: addLanguageTag,
    detect: detect
};