module.exports = (query) => {
    const splits = query.split('?');
    const url = splits[0];
    const prop = splits[1].split('&');

    let output = {
        url: url
    };
    prop.forEach(elm => {
        const key_value = elm.split('=');
        output[key_value[0]] = key_value[1];
    });

    return output;
};