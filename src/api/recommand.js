import {jsonp} from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from 'axios'

export function getRecommand() {
	const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

	const data = Object.assign({}, commonParams, {
		platform: 'h5',
		uin: 0,
		needNewCode: 1
	})

	return jsonp(url, data, options)
}

export function getDiscList() {
	const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg?callback=recom5021450231536428&g_tk=5381&jsonpCallback=recom5021450231536428&loginUin=0&hostUin=0&format=jsonp&inCharset=utf8&outCharset=utf-8&notice=0&platform=yqq&needNewCode=0&data=%7B%22comm%22%3A%7B%22ct%22%3A24%7D%2C%22recomPlaylist%22%3A%7B%22method%22%3A%22get_hot_recommend%22%2C%22param%22%3A%7B%22async%22%3A1%2C%22cmd%22%3A2%7D%2C%22module%22%3A%22playlist.HotRecommendServer%22%7D%7D&&callback=__jp1'
	return jsonp(url)
}

export function getSonglist(id) {
	const url = `/api/songlist`

	const data = {
		type: 1,
		json: 1,
		utf8: 1,
		onlysong: 0,
		disstid: id,
		format: 'json',
		g_tk: 5381,
		loginUin: 0,
		hostUin: 0,
		inCharset: 'utf8',
		outCharset: 'utf-8',
		notice: 0,
		platform: 'yqq',
		needNewCode: 0,
	}

	return axios.get(url,{
		headers: {id},
		params: data
	}).then((res) => {
		return Promise.resolve(res.data)
	})
}