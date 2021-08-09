const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.json(),
    transports: [
        new transports.File({ filename: `/usr/src/app/logs/zendesk-language-detector.log` }),
    ],
});

module.exports = logger;