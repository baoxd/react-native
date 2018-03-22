import { getUid } from '../common/uid';
import fetchData from './fetchData';

const URL = {
    VKeyUrl: `https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=json&cid=205361747&platform=yqq&hostUin=0&needNewCode=0&uin=0`
}

export default class HttpSong {
    async getVKey(songmid, filename) {
        url = `${URL.VKeyUrl}&songmid=${songmid}&filename=${filename}&guid=${getUid()}`;
        const data = fetchData(url);
        return data;
    }
}