const http = require('http');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

let option = {
    hostname: 'localhost',
    port: process.env.port || 5000,
    path: '/users?id=2',
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
};

let req = http.request(option, (res) => {
    res.on('data', (chunk) => {
        logger.info(chunk.toString());
    });
});
req.write(JSON.stringify({ status: 200, message: 'ok' }));
req.end();