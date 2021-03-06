import fetchData from './fetchData';

const URL = {
    discUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&sin=0&ein=29&sortId=5&needNewCode=0&categoryId=10000000&rnd=0.3049687912553909',
    bannerUrl: 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg',
    singerUrl: 'https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq',
    singerDetail: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&hostUin=0&needNewCode=0&platform=yqq&order=listen&begin=0&num=80&songstatus=1',
    songListUrl: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0',
    rankUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
    hotSearchUrl: 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&uin=0&needNewCode=1&platform=h5',
    searchUrl: 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&zhidaqu=1&t=0&flag=1&ie=utf-8&sem=1&aggr=0&catZhida=1&remoteplace=txt.mqq.all&uin=0&needNewCode=1&platform=h5',
    rankDetailUrl: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&needNewCode=1&uin=0&tpl=3&page=detail&type=top&platform=h5',
    lyricUrl: 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&platform=yqq&hostUin=0&needNewCode=0&categoryId=10000000',
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

    async getRank() {
        const text = await fetchData(URL.rankUrl, {
            dataType: 'text'
        });
        let reg = /(MusicJsonCallback\()/;
        let data = text.replace(reg, '').replace(/(\))+$/, ' ')
        return JSON.parse(data);
    }

    async getHot() {
        const data = await fetchData(URL.hotSearchUrl);
        return data;
    }

    async getSearch(query, page, zhida, perpage) {
        let url = `${URL.searchUrl}&w=${encodeURIComponent(query)}&p=${page}&perpage=${perpage}&n=${perpage}`;
        const text = await fetchData(url, {
            dataType: 'text',
        });
        let reg = /(callback\()/;
        let data = text.replace(reg, '').replace(/(\))+$/, ' ')
        return JSON.parse(data);
    }

    async getRankDetail(topid) {
        let url = `${URL.rankDetailUrl}&topid=${topid}`;
        const data = await fetchData(url);
        return data;
    }

    async getLyric(mid) {
        let url = `${URL.lyricUrl}&songmid=${mid}&pcachetime=${+new Date()}`;
        const text = await fetchData(url, {
            headers: {
                referer: 'https://c.y.qq.com/',
                host: 'c.y.qq.com'
            },
            dataType: 'text',
        });
        let data;
        const reg = /^\w+\(({.+})\)$/;
        const matches = text.match(reg);
        if (matches) {
            data = JSON.parse(matches[1]);
        }
        return data;
    }
}