const URL = {
    discUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3049687912553909',
    bannerUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',

}

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
            url += '?' + (data ? tileObject(data) : '');
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



export default class HttpMusic {

    async getDiscUrl() {
        const data = await fetchData(URL.discUrl, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com',
            }
        });
        return data;
    }

    async getBanner() {
        const data = await fetchData(URL.bannerUrl);
        return data;
    }
    
    
    

}