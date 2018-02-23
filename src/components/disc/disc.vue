<template>
	<transition name="slider">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>

<script>
	import musicList from 'components/music-list/music-list'
	import {mapGetters} from 'vuex'
	import {getSonglist} from 'api/recommand'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'

	export default {
		data () {
			return{
				songs: []
			}
		},
		computed: {
			title () {
				return this.disc.title
			},
			bgImage () {
				return this.disc.cover
			}, 
			...mapGetters([
				'disc'
			])
		},
		created () {
			this._getDetail()
		},
		methods: {
			_getDetail () {
				if (!this.disc.content_id) {
					this.$router.push('/recommand')
					return
				}
				getSonglist(this.disc.content_id).then((res) => {
					if (res.code === ERR_OK) {
						this.songs = this.normalSong(res.cdlist[0].songlist)
					}
				})
			},
			normalSong (list) {
				let ret = []
				list.forEach((item) => {
					ret.push(createSong(item))
				})
				return ret
			}, 
		},
		components: {
			musicList
		}
	}
</script>

<style lang="less" scoped>
	.slider-enter-active, .slider-leave-active{
		transition: all .3s;
	}
	.slider-enter, .slider-leave-to{
		transform: translate3d(100%, 0, 0);
	}
</style>