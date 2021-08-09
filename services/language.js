const cld = require('cld');
const axios = require('axios');

function filter(languages) {
    return languages.filter(language => process.env.LANGUAGES_TO_TAG.split(',').includes(language));
}

async function detect(text) {
    if (!text) {
        return [];
    }
    console.log(text);
    const result = await cld.detect(text);
    const languages = result.languages.map(lang => lang.name.toLowerCase()); // save all languages for now, could use probability to filter further
    console.log(languages);
    return filter(languages);
}

async function addLanguageTag(ticketId, language) {
    if (!ticketId || !language) {
        return;
    }
    await axios({
        method: "put",
        url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/update_many.json?ids=${ticketId}`,
        auth: {
            username: process.env.ZENDESK_USERNAME,
            password: process.env.ZENDESK_API_TOKEN,
        },
        data: {
            "ticket": {
                "additional_tags": `${language}_language`
            }
        }
    });
}

module.exports = {
    addLanguageTag: addLanguageTag,
    detect: detect
};