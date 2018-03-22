const tileObject = (obj) => {
    return obj ? Object.keys(obj).map((key)=> {
        return key + '=' + encodeURIComponent(obj[key]);
    }).join('&') : '';
}

const fetchData = (url, {data = {}, method = 'GET', headers = {}} = {}) => {
    const params = {
        method: method.toUpperCase(),
        headers,
    }
    switch(params.method) {
        case 'GET':
            if (url.indexOf('?') < 0 ) {
                url += '?' + (data ? tileObject(data) : '');
            }
            break;
        case 'POST':
            params.body = JSON.stringify(data);
            break;
        default:
            break;
    }

    return fetch(url, params).then((res) => {
        return res.json();
    }).catch((e) => {
        console.log('接口查询出错...');
        console.log(e);
    });
}

export default fetchData;