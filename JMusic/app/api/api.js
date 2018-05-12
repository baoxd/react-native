import fetchData from './fetchData';

const URL = {
    discUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3049687912553909',
    bannerUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    singerUrl: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq',
    singerDetail: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1',
    songListUrl: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0',

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

    async getSinger() {
        const data = await fetchData(URL.singerUrl);
        return data;
    }

    async getDetailSinger(singerId) {
        const data = await fetchData(`${URL.singerDetail}&singermid=${singerId}`);
        return data;
    }

    async getSongList(disstid) {
        const url = `${URL.songListUrl}&disstid=${disstid}`;
        const text = await fetchData(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            dataType: 'text',
        });
        let reg = /(jsonCallback\()/;
        let data1 = text.replace(reg, '').replace(/(\))+$/, ' ')
        return JSON.parse(data1);
    }


}