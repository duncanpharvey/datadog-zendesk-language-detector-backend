const axios = require('axios');

async function addLanguageTag(ticketId, language) {
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
    }).then(response => {
        console.log(response.status);
    });
}

module.exports = {
    addLanguageTag: addLanguageTag
};