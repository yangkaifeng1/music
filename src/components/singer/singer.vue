<template>
	<div class="singer" ref="singer">
		<listview @select="selectSinger" :data="singerList" ref="list"></listview>
		<router-view></router-view>
	</div>
</template>

<script>
	import {ERR_OK} from 'api/config'
	import {getSingerList} from 'api/singer'
	import {mapMutations} from 'vuex'
	import Singer from 'common/js/singer' 
	import Listview from 'base/listview/listview'
	import {playlistMixin} from 'common/js/mixin'

	const HOT_TITLE = "热门"
	const HOT_COUNT = 10

	export default {
		mixins: [playlistMixin],
		data () {
			return {
				singerList: []
			}
		},
		created () {
			this._getSingerList()
		},
		methods: {
			handlePlaylist (playlist) {
				const bottom = playlist.length > 0 ? '60px' : '' 
				this.$refs.singer.style.bottom = bottom
				this.$refs.list.refresh()
			},
			selectSinger (singer) {
				this.$router.push({
					path: `/singer/${singer.id}`
				})
				this.setSinger(singer)
			},
			_getSingerList () {
				getSingerList().then((res) => {
					if (res.code === ERR_OK) {
						this.singerList = this._normalizeSinger(res.data.list);
					}
				})
			},
			_normalizeSinger (list) {
				let map = {
					hot: {
						title: HOT_TITLE,
						items: []
					}
				}
				list.forEach((val, index) => {
					if (index < HOT_COUNT) {
						map.hot.items.push(new Singer({
							id: val.Fsinger_mid,
							name: val.Fsinger_name
						}))
					}
					let key = val.Findex
					if (!map[key]) {
						map[key] = {
							title: key,
							items: []
						}
					}
					map[key].items.push(new Singer({
						id: val.Fsinger_mid,
						name: val.Fsinger_name
					}))
				})
				let hot = []
				let ret = []
				let spe = []
				for (let key in map) {
					let val = map[key]
					if (val.title.match(/[a-zA-Z]/)) {
						ret.push(val)
					} else if (val.title === HOT_TITLE) {
						hot.push(val)
					} else {
						val.title = "#"
						spe.push(val)
					}
				}
				ret.sort((a,b) => {
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				})
				return hot.concat(ret, spe)
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			})
		},
		components: {
			Listview
		}
	}
</script>

<style lang="less" scoped>
	.singer{
		position: absolute;
		width: 100%;
		top: 88px;
		bottom: 0;
	}
</style>