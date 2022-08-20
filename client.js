const http = require('http');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';


let option = {
    hostname: 'localhost',
    port: process.env.port || 5000,
    path: '/users',
    headers: {
        'Content-Type': 'application/json',
    },
    method: 'GET',
};

const req = http.request(option, (res) => {
    res.on('data', (chunk) => {
        const data = JSON.parse(chunk);
        logger.info(data);
    });
});
req.write(JSON.stringify({ pid: 6, name: 'p6', price: 1600 }));
req.end();

http.request({
    hostname: 'localhost',
    port: process.env.port || 5000,
    path: '/statistics'
}, (res) => {
    res.on('data', (chunk) => {
        const data = JSON.parse(chunk);
        logger.info(data);
    });
}).end();