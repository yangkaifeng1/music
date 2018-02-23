<template>
	<transition name="slider">
		<div class="user-center">
			<div class="back" @click="back">
				<i class="icon-back"></i>
			</div>
			<div class="switches-wrapper">
				<switches :switches="switches" :curIndex="curIndex" @switchItem="changeIndex"></switches>
			</div>
			<div class="playBtn" @click="playRandom">
				<i class="icon-play"></i>
				<span class="text">随机播放全部</span>
			</div>
			<div class="list-wrapper" ref="listWrapper">
				<scroll ref="likeList" class="list-scroll" v-if="curIndex===0" >
					<div class="list-inner">
						<song-list :songs="likeSong" @select="selectSong"></song-list>
					</div>
				</scroll>
				<scroll ref="historyList" class="list-scroll"  v-if="curIndex===1" :data="playHistory">
					<div class="list-inner">
						<song-list :songs="playHistory"  @select="selectSong"></song-list>
					</div>
				</scroll>
			</div>
			<div class="no-result" v-show="noResult">
				<no-result :title="title"></no-result>
			</div>
		</div>
	</transition>
</template>

<script>
	import Switches from 'base/switches/switches'
	import Scroll from 'base/scroll/scroll'
	import songList from 'base/song-list/song-list'
	import noResult from 'base/no-result/no-result'
	import Song from 'common/js/song'
	import {mapGetters, mapActions} from 'vuex'
	import {playlistMixin} from 'common/js/mixin'

	export default {
		mixins: [playlistMixin],
		data () {
			return {
				curIndex: 0,
				switches: [
					{name: '我喜欢的'},
					{name: '最近听的'}
				]
			}
		},
		computed: {
			noResult () {
				if (this.curIndex === 0) {
					return !this.likeSong.length
				} else {
					return !this.playHistory.length
				}
			},
			title () {
				if (this.curIndex === 0) {
					return '暂无收藏歌曲'
				} else {
					return '你还没有听过歌曲'
				}
			},
			...mapGetters([
				'playHistory',
				'likeSong'
			])
		},
		methods: {
			playRandom () {
				let list = this.curIndex === 0 ? this.likeSong : this.playHistory
				
				if (!list.length) {
					return
				}
				list = list.map((item) => {
					return new Song(item)
				})
				this.randomPlay(list)
			},
			handlePlaylist (playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.listWrapper.style.bottom = bottom
				this.$refs.likeList && this.$refs.likeList.refresh()
				this.$refs.historyList && this.$refs.historyList.refresh()
 			},
			selectSong (song) {
				this.addSong(new Song(song))
			},
			back () {
				this.$router.back()
			},
			changeIndex (index) {
				this.curIndex = index
			},
			...mapActions([
				'addSong',
				'randomPlay'
			])
		},
		components: {
			Switches,
			Scroll,
			songList,
			noResult
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';

	.user-center{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 100;
		background: @color-background;
		&.slider-enter-active, &.slider-leave-active{
			transition: all .3s;
		}
		&.slider-enter, &.slider-leave-to{
			transform: translate3d(100%, 0, 0);
		}
		.back{
			position: absolute;
			top: 0;
			left: 6px;
			z-index: 50;
			.icon-back{
				display: block;
				padding: 10px;
				font-size: @font-size-large-x;
				color: @color-theme;
			}
		}
		.switches-wrapper{
			margin: 10px 0 30px 0;
		}
		.playBtn{
			box-sizing: border-box;
			width: 135px;
			padding: 7px 0;
			margin: 0 auto;
			text-align: center;
			border: 1px solid @color-text-l;
			color: @color-text-l;
			border-radius: 100px;
			font-size: 0;
			.icon-play{
				display: inline-block;
				vertical-align: middle;
				margin-right: 6px;
				font-size: @font-size-medium-x;
			}
			.text{
				display: inline-block;
				vertical-align: middle;
				font-size: @font-size-small;
			}
		}
		.list-wrapper{
			position: absolute;
			top: 110px;
			bottom: 0;
			width: 100%;
			.list-scroll{
				height: 100%;
				overflow: hidden;
				.list-inner{
					padding: 20px 0;
				}
			}
		}
		.no-result{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>