module.exports = (query) => {
    // console.log(query.split(/[?&=]/));

    var splits = query.split('?');
    const url = splits[0];

    let output = {
        url: url
    };
    splits = splits.filter(elm => {
        return elm != '';
    });

    try {
        const prop = splits[1].split('&');
        prop.forEach(elm => {
            const key_value = elm.split('=').filter(elm => {
                return elm != '';
            });
            if (key_value[0] == '' || key_value[1] == '');
            else
                output[key_value[0]] = key_value[1];
        });
    } catch {

    }
    return output;
};