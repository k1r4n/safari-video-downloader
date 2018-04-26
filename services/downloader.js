const { exec } = require('child_process');

const winston = require('./winston');
const config = require('../config');

module.exports = {
    downloadVideo: async function (options) {
        const logger = winston.getClient();
        try {
            logger.info(`Downloading video: ${config.link}`);
            return await exec(`cd ${config.location}/${options.currentChapter} && youtube-dl -u ${config.username} -p ${config.password} -o "${options.index}-%(title)s.%(ext)s" ${options.link}`, (err, stdout, stderr) => {
                if (err) {
                    logger.error(err);
                    process.exit(1);
                }
                if (stderr) {
                    logger.error(stderr);
                    process.exit(1);
                }
                logger.info(stdout);
            });
        } catch (error) {
            logger.error(error);
            process.exit(1);
        }
    }
};