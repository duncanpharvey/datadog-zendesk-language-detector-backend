const { createLogger, format, transports } = require('winston');

const httpTransportOptions = {
    host: 'http-intake.logs.datadoghq.com',
    path: `/v1/input/${process.env.DATADOG_API_KEY}?ddsource=nodejs&service=zendesk-language-detector`,
    ssl: true
};

const logger = createLogger({
    level: 'info',
    exitOnError: false,
    format: format.json(),
    transports: [
        new transports.Http(httpTransportOptions),
    ],
});

module.exports = logger;