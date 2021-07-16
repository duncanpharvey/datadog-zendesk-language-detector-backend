const cld = require('cld');

function filter(languages) {
    return languages.filter(language => process.env.LANGUAGES_TO_TAG.split(',').includes(language));
}

async function detect(text) {
    const result = await cld.detect(text);
    const languages = result.languages.map(lang => lang.name.toLowerCase()); // save all languages for now, TODO: use probability to filter further?
    console.log(languages);
    return filter(languages);
}

module.exports = {
    detect: detect
};