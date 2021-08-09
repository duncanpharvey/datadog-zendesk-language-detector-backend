const cld = require('cld');
const axios = require('axios');

function filter(languages) {
    return languages.filter(language => process.env.LANGUAGES_TO_TAG.split(',').includes(language));
}

async function detect(text) {
    if (!text) {
        console.log("unable to detect language, missing text");
        return [];
    }
    const result = await cld.detect(text);
    const languages = result.languages.map(lang => lang.name.toLowerCase()); // save all languages for now, could use probability to filter further
    console.log(JSON.stringify({ message: `languages detected: ${languages}`, languages: languages }));
    return filter(languages);
}

async function addLanguageTag(ticketId, languages) {
    if (!ticketId) {
        console.log("unable to update Zendesk ticket with language tag, missing ticket id");
        return false;
    }
    if (!languages || languages.length == 0) {
        console.log(JSON.stringify({ message: "unable to update Zendesk ticket with language tag, missing language", ticketId: ticketId }));
        return false;
    }
    const language_tags = languages.map(language => `${language}_language`);
    await axios({
        method: "put",
        url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/update_many.json?ids=${ticketId}`,
        auth: {
            username: process.env.ZENDESK_USERNAME,
            password: process.env.ZENDESK_API_TOKEN,
        },
        data: {
            "ticket": {
                "additional_tags": language_tags
            }
        }
    });
    return true;
}

module.exports = {
    addLanguageTag: addLanguageTag,
    detect: detect
};