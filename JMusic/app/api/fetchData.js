const tileObject = (obj) => {
    return obj ? Object.keys(obj).map((key)=> {
        return key + '=' + encodeURIComponent(obj[key]);
    }).join('&') : '';
}

const fetchData = (url, {data = {}, method = 'GET', headers = {}, dataType = 'json'} = {}) => {
    let params = {
        headers,
    }
    let Method = method.toUpperCase();

    switch(Method) {
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

    return fetch(url, {
        headers: params.headers,
    }).then((res) => {
        if (dataType === 'json') {
            return res.json();
        } else {
            return res.text();
        }
    }).catch((e) => {
        console.log(e);
    });
}

export default fetchData;