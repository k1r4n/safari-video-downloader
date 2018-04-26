const getResp = require('./test');

async function init () {
    const resp = await getResp.getLinks();
    console.log(resp);
}

init();