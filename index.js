const handler = require('./handler');
const winston = require('./services/winston');

async function init () {
    await winston.initialize();
    await handler.handleDownload();
}

init();