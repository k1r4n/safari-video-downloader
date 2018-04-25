const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

request({
    uri: 'https://www.safaribooksonline.com/library/view/learning-path-javascript/9781788471282/',
}, (error, response, body) => {
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
    fs.writeFile('link.js', `module.exports = ${JSON.stringify(tableOfContent, null, 2)}`, 'utf8', function (err) {
        if (err) throw err;
        console.log('Saved!');
    });
});