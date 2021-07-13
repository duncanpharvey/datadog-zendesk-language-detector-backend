const langdetect = require('langdetect');
const ISO6391 = require('iso-639-1');

function detect(text) {
    console.log(langdetect.detectOne(text));
    const langCode = langdetect.detectOne(text).split('-')[0]; // handles cases with subtags like zh-cn and zh-tw
    const langName = ISO6391.getName(langCode);
    return langName ? langName.toLowerCase() : "undefined";
}

module.exports = {
    detect: detect
};