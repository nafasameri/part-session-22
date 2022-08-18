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
    'GET': (list, key_val) => {
        res.setHeader('Content-Type', 'application/json');
        res.write(JSON.stringify(list));

        let isFound = false;
        list.forEach((elm) => {
            if (elm[key_val[0]] == key_val[1]) {
                isFound = true;
                res.write(JSON.stringify({
                    status: 200,
                    message: 'successfull fetch',
                    data: JSON.stringify(elm)
                }));
            }
        });
        if (!isFound)
            res.write(JSON.stringify({ status: 404, message: 'Not Found!' }));

        return res.end();
    },
    'POST': (list, data) => {
        res.setHeader('Content-Type', 'application/json');
        try {
            list.push(data);
            res.write(JSON.stringify({
                status: 200,
                message: `successfull add with id ${sucess} `,
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
    'PUT': (list, key_val, data) => {
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
    'DELETE': (list, key_val) => {
        res.setHeader('Content-Type', 'application/json');

        let isFound = false;
        list.forEach((elm, index) => {
            if (elm[key_val[0]] == key_val[1]) {
                delete list[index];
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
    '/users': (req, res) => {
        const { url, method } = req;
        return crud.GET(users, ['id', -1]);
    },
    '/products': (req, res) => {
        const { url, method } = req;
        return crud.GET(products, ['pid', -1]);
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
        res.write(JSON.stringify({ status: 404, message: 'Not found!' }));
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