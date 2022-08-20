const queryGetParser = require('query-get-parser');
const statistics = {
    users: {
        GET: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        POST: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        PUT: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        DELETE: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        }
    },
    products: {
        GET: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        POST: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        PUT: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        },
        DELETE: {
            requestTimes: [],
            avgTime: 0,
            totalTime: 0,
            requestCounts: 0
        }
    }
};

const users = [
    { id: 1, name: 'reza', age: 10 },
    { id: 2, name: 'zahra', age: 12 },
    { id: 3, name: 'nahid', age: 13 },
    { id: 4, name: 'amin', age: 14 },
    { id: 5, name: 'kosar', age: 15 }
];

const products = [
    { pid: 1, name: 'p1', price: 1000 },
    { pid: 2, name: 'p2', price: 1200 },
    { pid: 3, name: 'p3', price: 1300 },
    { pid: 4, name: 'p4', price: 1400 },
    { pid: 5, name: 'p5', price: 1500 }
]

const crud = {
    'GET': (res, list, key_val, pagination) => {
        res.setHeader('Content-Type', 'application/json');
        pagination.page = pagination.page == undefined ? 1 : pagination.page;
        pagination.nperpage = pagination.nperpage == undefined ? 10 : pagination.nperpage;

        try {
            let data = [];
            if (key_val.length == 0) {
                data = list;
            }
            else {
                data = [];
                key_val.forEach((elm) => {
                    const row = list.filter(val => val[elm[0]] == elm[1]);
                    if (row.length != 0)
                        data.push(row);
                });

                if (data.length == 0)
                    res.write(JSON.stringify({ status: 404, message: 'Data Not Found!' }));
            }

            const output = [];
            for (let i = (pagination.page - 1) * pagination.nperpage; i < pagination.page * pagination.nperpage; i++) {
                if (data[i] != null)
                    output.push(data[i]);
            }
            res.write(JSON.stringify({
                status: 200,
                message: 'successfull fetch',
                data: JSON.stringify(output)
                // data: JSON.stringify(data.splice((pagination.page - 1) * pagination.nperpage, pagination.page * pagination.nperpage))
            }));
        } catch (error) {
            res.write(JSON.stringify({ status: 400, message: error.toString() }));
        }
        return res.end();
    },
    'POST': (res, list, data) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            data = JSON.parse(data);
            list.push(data);

            res.write(JSON.stringify({
                status: 200,
                message: `successfull add with id ${data[Object.keys(data)[0]]}`,
                data: JSON.stringify(data)
            }));
        } catch (error) {
            res.write(JSON.stringify({
                status: 400,
                message: 'could not create'
            }));
        }
        return res.end();
    },
    'PUT': (res, list, key_val, data) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            let isFound = false;
            list.forEach((elm, index) => {
                if (elm[key_val[0]] == key_val[1]) {
                    isFound = true;
                    list[index] = data;
                    res.write(JSON.stringify({
                        status: 200,
                        message: `successfull update with id ${elm[key_val[0]]} `
                    }));
                }
            });
            if (!isFound)
                res.write(JSON.stringify({
                    status: 404,
                    message: 'Data Not Found!'
                }));
        } catch (error) {
            res.write(JSON.stringify({
                status: 400,
                message: error
            }));
        }

        return res.end();
    },
    'DELETE': (res, list, key_val) => {
        res.setHeader('Content-Type', 'application/json');

        let isFound = false;
        list.forEach((elm, index) => {
            if (elm[key_val[0]] == key_val[1]) {
                list.splice(index, 1);
                isFound = true;
                res.write(JSON.stringify({
                    status: 200,
                    message: `successfull deleted with id ${elm[key_val[0]]} `
                }));
            }
        });
        if (!isFound)
            res.write(JSON.stringify({
                status: 404,
                message: 'Data Not Found!'
            }));

        return res.end();
    }
};


const router = {
    '/users': (req, res, query) => {
        const startDate = Date.now();
        const { method } = req;
        let data = '';
        req.on('data', function (chunk) {
            data += chunk.toString();
        });

        if (method == 'GET') {
            const { page, nperpage } = query;

            delete query.page;
            delete query.nperpage;
            key_val = KeyVal(query);

            crud[method](res, users, key_val, { page: page, nperpage: nperpage });
        }
        if (method == 'POST') {
            req.on('end', () => {
                return crud[method](res, users, data);
            });
        }
        if (method == 'PUT') {
            key_val = KeyVal(query);
            req.on('end', () => {
                return crud[method](res, users, key_val[0], data);
            });
        }
        if (method == 'DELETE') {
            key_val = KeyVal(query);
            return crud[method](res, users, key_val[0]);
        }
        createStatistics(startDate, statistics.users[method]);
    },
    '/products': (req, res, query) => {
        const startDate = Date.now();
        const { method } = req;
        let data = '';
        req.on('data', function (chunk) {
            data += chunk.toString();
        });

        if (method == 'GET') {
            const { page, nperpage } = query;

            delete query.page;
            delete query.nperpage;
            key_val = KeyVal(query);

            return crud[method](res, products, key_val, { page: page, nperpage: nperpage });
        }
        if (method == 'POST') {
            req.on('end', () => {
                return crud[method](res, products, data);
            });
        }
        if (method == 'PUT') {
            key_val = KeyVal(query);
            req.on('end', () => {
                return crud[method](res, products, key_val[0], data);
            });
        }
        if (method == 'DELETE') {
            key_val = KeyVal(query);
            return crud[method](res, products, key_val[0]);
        }
        createStatistics(startDate, statistics.products[method]);
    },
    '/statistics': (req, res, query) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(statistics.users.GET, 4));
        return res.end();
    },
    '404': (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify({ status: 404, message: 'Not found!' }));
        return res.end();
    }
}

function KeyVal(query) {
    key_val = [];
    for (const key in query) {
        if (key != 'url')
            key_val.push([key, query[key]]);
    }
    return key_val;
}

function createStatistics(startDate, statistic) {
    const endDate = Date.now();
    statistic.requestTimes.push({
        startDate: startDate,
        endDate: endDate,
        duration: endDate - startDate
    });
    statistic.requestCounts++;
    statistic.totalTime = statistic.requestTimes.reduce((a, b) => a.duration + b.duration);
    statistic.avgTime = statistic.totalTime / statistic.requestCounts;
}

module.exports = (req, res) => {
    const { url, method } = req;

    const query = queryGetParser(url);
    console.log(query);

    if (query.url in router) {
        return router[query.url](req, res, query);
    }

    return router['404'](req, res);
};