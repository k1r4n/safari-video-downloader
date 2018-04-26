const fs = require('fs');

const config = require('../config');
const winston = require('../services/winston');
const downloader = require('../services/downloader');
const webscrapper = require('../services/webscrapper');

module.exports = {
    handleDownload: async function () {
        const logger = winston.getClient();
        try {
            await webscrapper.getVideoLinks();
            if (!fs.existsSync(config.location)) {
                logger.info(`Creating course folder`)
                fs.mkdirSync(config.location);
            }
            const link = require('../link');
            for (const chapter in link) {
                if (link.hasOwnProperty(chapter)) {
                    if (!fs.existsSync(`${config.location}/${chapter}`)) {
                        logger.info(`Creating chapter folder: ${chapter}`);
                        fs.mkdirSync(`${config.location}/${chapter}`);
                    }
                    for (const module in link[chapter]) {
                        const options = {
                            currentChapter: chapter,
                            index: Object.keys(link[chapter]).indexOf(module),
                            link: link[chapter][module],
                        };
                        await downloader.downloadVideo(options);
                    }
                }
            }
            fs.unlinkSync('link.js');
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }
};

