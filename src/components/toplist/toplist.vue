<template>
	<transition name="slider">
		<music-list :songs="songs" :title="title" :bg-image="bgImage" :rank="rank"></music-list>
	</transition>
</template>

<script>
	import musicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSonglist} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'

	export default {
		data () {
			return {
				songs: [],
				rank: true
			}
		},
		computed: {
			title () {
				return this.topList.topTitle
			},
			bgImage () {
				if (this.songs.length) {
					return this.songs[0].image
				}
				return ''
			},
			...mapGetters([
				'topList'
			])
		},
		created () {
			this._getSonglist()
		},
		methods: {
			_getSonglist () {
				if (!this.topList.id) {
					this.$router.push('/rank')
					return
				}
				getSonglist(this.topList.id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this.normalSonglist(res.songlist)
					}
				})
			},
			normalSonglist (list) {
				let ret = []
				list.forEach((item) => {
					let {data} = item
					if (data.albummid && data.songid) {
						ret.push(createSong(data))
					}
				})
				return ret
			}
		},
		components: {
			musicList
		}
	}
</script>

<style lang="less" scoped>
	.slider-enter-active, .slider-leave-active{
		transition: all .3s
	}
	.slider-enter, .slider-leave-to{
		transform: translate3d(100%, 0, 0);
	}
</style>