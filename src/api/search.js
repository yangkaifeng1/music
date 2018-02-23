import {jsonp} from 'common/js/jsonp'
import {options} from './config'

export function getHot () {
	const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

	const data = {
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		format: 'jsonp',
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq',
		needNewCode: 0,
	}

	return jsonp(url, data, options)
}

export function search (query, page, zhida, perpage) {
	const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

	const data = {
		g_tk: 5381,
		uin: 0,
		format: 'jsonp',
		inCharset: 'utf-8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'h5',
		needNewCode: 1,
		w: query,
		zhidaqu: 1,
		catZhida: zhida ? 1 : 0,
		t: 0,
		flag: 1,
		ie: 'utf-8',
		sem: 1,
		aggr: 0,
		perpage: perpage,
		n: perpage,
		p: page,
		remoteplace: 'txt.mqq.all'
	}

	return jsonp(url, data, options)
} 