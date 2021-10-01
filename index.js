const cld = require('cld');
const axios = require('axios');
const AWS = require('aws-sdk');

const client = new AWS.SecretsManager({ region: process.env.AWS_REGION });

async function getZendeskApiToken() {
  const data = await client.getSecretValue({ SecretId: process.env.ZENDESK_API_TOKEN_SECRET_NAME }).promise();
  return JSON.parse(data.SecretString).ZENDESK_API_TOKEN;
}

function filter(languages) {
  return languages.map(language => language == "chineset" ? "chinese" : language).filter(language => process.env.LANGUAGES_TO_TAG.split(',').includes(language));
}

async function detect(ticketId, text) {
  if (!text) {
    console.log(`unable to detect language for zendesk ticket ${ticketId}, missing text`);
    return [];
  }
  const result = await cld.detect(text);
  console.log(`languages detected for zendesk ticket ${ticketId}: ${JSON.stringify(result.languages)}`);
  const languages = result.languages.map(lang => lang.name.toLowerCase()); // save all languages for now, could use probability to filter further
  return filter(languages);
}

async function addLanguageTag(ticketId, languages) {
  if (!ticketId) {
    console.log("unable to update zendesk ticket with language tag, missing ticket id");
    return false;
  }
  if (!languages || languages.length == 0) {
    console.log(`unable to update zendesk ticket ${ticketId} with language tag, missing language`);
    return false;
  }
  const language_tags = languages.map(language => `${language}_language`);
  var success;
  const zendeskApiToken = await getZendeskApiToken();
  await axios({
    method: "put",
    url: `https://${process.env.ZENDESK_SUBDOMAIN}.zendesk.com/api/v2/tickets/${ticketId}/tags`,
    auth: {
      username: process.env.ZENDESK_USERNAME,
      password: zendeskApiToken,
    },
    data: {
      "tags": language_tags
    }
  }).then(() => { success = true; }).catch(() => { success = false; });
  return success;
}

exports.handler = async (event) => {
  const req = JSON.parse(event.body);
  if (!req.ticketId) {
    const response = {
      statusCode: 400,
      body: "unable to update zendesk ticket with language tag, missing ticket id",
    };
    console.log(response);
    return response;
  }

  if (!req.firstComment) {
    const response = {
      statusCode: 400,
      body: `unable to detect language for zendesk ticket ${req.ticketId}, missing text`,
    };
    console.log(response);
    return response;
  }

  const languages = await detect(req.ticketId, req.firstComment).catch(err => console.log(err));;
  if (languages.length == 0) {
    const response = {
      statusCode: 200,
      body: `no languages to tag for zendesk ticket ${req.ticketId}`,
    };
    console.log(response);
    return response;
  }

  const language_tags_added = await addLanguageTag(req.ticketId, languages).catch(err => console.log(err));

  if (language_tags_added) {
    const response = {
      statusCode: 200,
      body: `updated zendesk ticket ${req.ticketId} with language tags for ${languages}`,
    };
    console.log(response);
    return response;
  }
  else {
    const response = {
      statusCode: 400,
      body: `failed to update zendesk ticket ${req.ticketId} with language tags for ${languages}`,
    };
    console.log(response);
    return response;
  }
};
