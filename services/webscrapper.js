const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');
const Promise = require('bluebird');

const winston = require('./winston');
const config = require('../config');
 
module.exports = {
    getVideoLinks: async function () {
        const logger = winston.getClient();
        logger.info(`Fetching links from ${config.course}`);
        return new Promise(async function (resolve, reject) {
            try {
                return await request({
                    uri: config.course,
                }, (error, response, body) => {
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
                            tableOfContent[currentChapter] = {};
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
                    logger.info('Links saved to link.js');
                    resolve();
                });
            } catch (error) {
                logger.error(error);
                reject(error);
            }
        })
    }
}