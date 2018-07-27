const fs = require('fs');
const Promise = require('bluebird');

const config = require('../config');
const winston = require('../services/winston');
const downloader = require('../services/downloader');
const webscrapper = require('../services/webscrapper');

module.exports = {
    handleDownload: async function () {
        const logger = winston.getClient();
        return new Promise(async function (resolve, reject) {
            try {
                await webscrapper.getVideoLinks();
                if (!fs.existsSync(config.location)) {
                    logger.info(`Creating course folder`)
                    fs.mkdirSync(config.location);
                }
                const link = require('../link');
                const chapters = Object.keys(link);
                for (let chapter of chapters) {
                    if (link.hasOwnProperty(chapter)) {
                        if (!fs.existsSync(`${config.location}/${chapter}`)) {
                            logger.info(`Creating chapter folder: ${chapter}`);
                            fs.mkdirSync(`${config.location}/${chapter}`);
                        }
                        const modules = Object.keys(link[chapter]);
                        for (let module of modules) {
                            const options = {
                                currentChapter: chapter,
                                index: Object.keys(link[chapter]).indexOf(module),
                                link: link[chapter][module],
                                module: module,
                            };
                            if (!fs.existsSync(`${config.location}/${chapter}/${options.index}-${options.module.replace(/_/g," ")}.mp4`)) {
                                await downloader.downloadVideo(options);
                            }
                        }
                    }
                }
                fs.unlinkSync('link.js');
                resolve();
            } catch (error) {
                logger.error(error);
                reject(error);
            }
        });
    }
};

