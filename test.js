const fs = require('fs');
const request = require('request');
const cheerio = require('cheerio');

// const winston = require('./winston');
// const config = require('../config');

var resp;
module.exports = {
    getLinks: async function () {
        await request({uri: 'https://google.co.in'}, (error, response, body) => {
            if (error) {
                console.log(error);
            }
            resp = body;
            console.log(resp);
        });
        return resp;
    }
};