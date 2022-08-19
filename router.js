const queryGetParser = require('query-get-parser');

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
    'GET': (res, list, key_val) => {
        res.setHeader('Content-Type', 'application/json');

        try {
            if (key_val[0][1] == -1)
                res.write(JSON.stringify({
                    status: 200,
                    message: 'successfull fetch',
                    data: JSON.stringify(list)
                }));
            else {
                const output = [];
                key_val.forEach((elm) => {
                    const row = list.filter(val => val[elm[0]] == elm[1]);
                    if (row.length != 0)
                        output.push(row);
                });

                if (output.length != 0)
                    res.write(JSON.stringify({
                        status: 200,
                        message: 'successfull fetch',
                        data: JSON.stringify(output)
                    }));
                else
                    res.write(JSON.stringify({ status: 404, message: 'Not Found!' }));
            }
        } catch (error) {

        }
        return res.end();
    },
    'POST': (res, list, data) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            list.push(data);
            data = JSON.parse(data);

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
                    message: 'Not Found!'
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
                message: 'Not Found!'
            }));

        return res.end();
    }
};


const router = {
    '/users': (req, res, query) => {
        const { method } = req;
        let data = '';
        req.on('data', function (chunk) {
            data += chunk.toString();
        });

        if (method == 'GET') {
            key_val = KeyVal(query);
            return crud[method](res, users, key_val);
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
    },
    '/products': (req, res, query) => {
        const { method } = req;
        let data = '';
        req.on('data', function (chunk) {
            data += chunk.toString();
        });

        if (method == 'GET') {
            key_val = KeyVal(query);
            return crud[method](res, products, key_val);
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
    },
    '404': (req, res) => {
        const { url } = req;
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

const requestHandler = (req, res) => {
    const { url, method } = req;

    const query = queryGetParser(url);
    console.log(query);

    if (query.url in router) {
        return router[query.url](req, res, query);
    }

    return router['404'](req, res);
};


module.exports = requestHandler;