const winston = require('winston');

const config = require('../config');

module.exports = {
    initialize: async function () {
        return await winston.configure({
            transports: [
                new winston.transports.Console({
                    level: 'debug',
                    handleExceptions: true,
                    colorize: true,
                }),
            ],
        });
    },
    getClient: function () {
        return winston;
    }
};