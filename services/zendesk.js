const axios = require('axios');

async function addLanguageTag(ticketId, tags, language) {
    var tagsArr = tags.split(" ");
    tagsArr.push(`language_${language}`); // add language tag while maintaining other tags
    await axios({
        method: "put",
        url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticketId}`,
        auth: {
            username: process.env.ZENDESK_USERNAME,
            password: process.env.ZENDESK_API_TOKEN,
        },
        data: {
            "ticket": {
                "tags": tagsArr
            }
        }
    }).then(response => {
        console.log(response.status);
    });
}

module.exports = {
    addLanguageTag: addLanguageTag
};