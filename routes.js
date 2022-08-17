const queryGetParser = require('query-get-parser');

const users = [
    { id: 1, name: 'ali1', age: 10 },
    { id: 2, name: 'ali2', age: 10 },
    { id: 3, name: 'ali3', age: 10 }
];

const router = {
    '/users': (req, res) => {
        const { url, method } = req;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(users));
        return res.end();
    },
    '/users-withfilter': (req, res, keys, values) => {
        const { url, method } = req;
        res.setHeader('Content-Type', 'application/json');
        let output = [];
        for (let i = 1; i < keys.lenght; i++) {
            console.log(users[keys[i]], values[i]);
            output.push(users.filter(u => u[keys[i]] == values[i]));
        }
        res.write(JSON.stringify(output));
        return res.end();
    },
    '404': (req, res) => {
        const { url } = req;
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ status: 404, message: 'Not found' }));
        return res.end();
    }
}


const requestHandler = (req, res) => {
    const { url, method } = req;

    if (url in router) {
        return router[url](req, res);
    }

    const query = queryGetParser(url);
    return router[query.url + '-withfilter'](req, res, Object.keys(query), Object.values(query));

    // return router['404'](req, res);
};


module.exports = requestHandler;