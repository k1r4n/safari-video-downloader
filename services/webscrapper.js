const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

const winston = require('./winston');
const config = require('../config');
 
module.exports = {
    getVideoLinks: async function () {
        const logger = winston.getClient();
        logger.info(`Fetching links from ${config.course}`);
        try {
            return await request({
                uri: config.course,
            }, (error, response, body) => {
                console.log('func');
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
                        currentChapter = $(link).text().replace(/ /g,"_");;
                        tableOfContent[$(link).text()] = {};
                    }
                    if ($(link).text() === 'Explore') {
                        flag = false;
                    }
                    if (flag) {
                        if (!($(link).text().split(' ')[0] === 'Chapter')) {
                            tableOfContent[currentChapter][$(link).text().replace(/ /g,"_")] = $(link).attr('href');
                        }
                    }
                });
                fs.writeFileSync('link.js', `module.exports = ${JSON.stringify(tableOfContent, null, 2)}`, 'utf8');
                logger.info('Links saved to link.json');
            });
        } catch (error) {
            logger.error(error);
        }
    }
}