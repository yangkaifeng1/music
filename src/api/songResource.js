import {jsonp, param} from 'common/js/jsonp'
import axios from 'axios'
import { commonParams, options } from './config'
import {getUid} from 'common/js/uid.js'
 
// export function getSongResource (songmid, filename) {
// 	const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

// 	const data = {
// 		g_tk: 5381,
// 		loginUin: 0,
// 		hostUin: 0,
// 		format: 'json',
// 		inCharset: 'utf8',
// 		outCharset: 'utf-8',
// 		notice: 0,
// 		platform: 'yqq',
// 		needNewCode: 0,
// 		cid: 205361747,
// 		uin: 0,
// 		songmid,
//     	filename,
// 		guid: getUid()
// 	} 

// 	return jsonp(url, data)
// }

export function getVKey(songmid, filename) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg'

  const data = Object.assign({}, commonParams, {
    cid: 205361747,
    format: 'json',
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    uin: 0,
    songmid,
    filename,
    guid: getUid()
  })

  return jsonp(url, data, Object.assign({}, options, {
    param: 'callback'
  }))
}

export function getSongtext (mid) {
	const url = '/api/lyric'

	const data = {
		pcachetime: +new Date(),
		songmid: mid,
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		format: 'json',
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq',
		needNewCode: 0
	} 

	return axios.get(url, {
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}