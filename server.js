const http = require('http');
const log4js = require('log4js');
const requestHandler = require('./router');

const logger = log4js.getLogger();
logger.level = 'debug';

const server = http.createServer(requestHandler);

const port = process.env.port || 5000;

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});