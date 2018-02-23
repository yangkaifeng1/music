import {jsonp} from 'common/js/jsonp'
import {options} from './config'
 
export function getRanklist () {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_myqq_toplist.fcg'

	const data = {
		g_tk: 5381,
		uin: 0,
		format: 'jsonp',
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'h5',
		needNewCode: 1
	}

	return jsonp(url, data, options)
}

export function getSonglist (id) {
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_toplist_cp.fcg'

	const data = {
		tpl: 3,
		page: 'detail',
		topid: id,
		type: top,
		song_begin: 0,
		song_num: 30,
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		format: 'jsonp',
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq',
		needNewCode: 0
	}

	return jsonp (url, data, options)
}