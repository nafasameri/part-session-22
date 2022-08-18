const http = require('http');
const requestHandler = require('./router');

const server = http.createServer(requestHandler);

const port = process.env.port || 5000;

server.listen(port, () => {
    console.log(`server is running on port ${port}`);
});