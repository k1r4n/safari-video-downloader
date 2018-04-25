const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const winston = require('./winston');
const config = require('../config');
 
module.exports = {
    getVideoLinks: async function () {
        const logger = winston.getClient();
        logger.info('Fetching links');
        return await request({
            uri: config.course,
        }, async (error, response, body) => {
            if (error) {
                logger.error(error);
                process.exit(1);
            }
            const $ = cheerio.load(body);
            const links = $('a');
            let flag = false;
            const tableOfContent = {};
            let currentChapter;
            $(links).each(function(i, link){
                if ($(link).text().split(' ')[0] === 'Chapter') {
                    flag = true;
                    tableOfContent[$(link).text()] = {};
                    currentChapter = $(link).text();
                }
                if ($(link).text() === 'Explore') {
                    flag = false;
                }
                if (flag) {
                    if (!($(link).text().split(' ')[0] === 'Chapter')) {
                        tableOfContent[currentChapter][$(link).text()] = $(link).attr('href');
                    }
                }
            });
            await fs.writeFile('link.js', `module.exports = ${JSON.stringify(tableOfContent, null, 2)}`, 'utf8', function (err) {
                if (err) {
                    logger.error(err);
                    process.exit(1);
                }
                logger.info('Links saved to link.json');
            });
        });

    }
}