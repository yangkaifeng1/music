<template>
	<transition name="slider">
		<div class="add-song" @click.stop v-show="showFlag">
			<div class="header">
				<h1 class="title">添加歌曲到播放列表</h1>
				<div class="close" @click="hide">
					<i class="icon-no"></i>
				</div>
			</div>
			<div class="search-box-wrapper">
				<search-box @query="onQueryChange" ref="searchBox" placeholder="搜索歌曲"></search-box>
			</div>
			<div class="shortcut" v-show="!query">
				<switches :switches="switches" :curIndex="curIndex" @switchItem="changeIndex"></switches>
				<div class="list-wrapper">
					<scroll ref="songList" :data="playHistory" v-if="curIndex===0" class="list-scroll">
						<div class="list-inner">
							<song-list :songs="playHistory" @select="selectItem"></song-list>
						</div>
					</scroll>
					<scroll ref="historyList" :data="searchHistory" v-if="curIndex===1" class="list-scroll">
						<div class="search-inner">
							<history-list :searches="searchHistory" @select="addQuerry"  @deleteOne="deleteHistory">
							</history-list>
						</div>
					</scroll>
				</div>
			</div>
			<div class="search-result" v-show="query">
				<suggest @select="selectSearch" :query="query" @listScroll="blurInput" :zhida="showSinger"></suggest>
			</div>
			<top-tip ref="topTip" :delay="delay">
				<div class="tip-title">
					<i class="icon-ok"></i>
					<span class="text">1首歌曲已经添加到播放列表</span>
				</div>
			</top-tip>
		</div>
	</transition>
</template>

<script>
	import searchBox from 'base/search-box/search-box'
	import Suggest from 'components/suggest/suggest'
	import Switches from 'base/switches/switches'
	import Scroll from 'base/scroll/scroll'
	import songList from 'base/song-list/song-list'
	import historyList from 'base/history-list/history-list'
	import topTip from 'base/top-tip/top-tip'
	import {searchMixin} from 'common/js/mixin'
	import {mapGetters, mapActions} from 'vuex'
	import Song from 'common/js/song.js'

 	export default {
 		mixins: [searchMixin],
		data () {
			return{
				showFlag: false,
				showSinger: false,
				curIndex: 0,
				delay: 3000,
				switches: [
					{name: '最近播放'},
					{name: '搜索历史'}
				]
			}
		},
		computed: {
			...mapGetters([
				'playHistory'
			])
		},
		methods: {
			show () {
				this.showFlag = true
				setTimeout(() => {
					if (this.curIndex === 0) {
						this.$refs.songList.refresh()
					} else {
						this.$refs.historyList.refresh()
					}
				}, 20)
			},
			hide () {
				this.showFlag = false
			},
			changeIndex (index) {
				this.curIndex = index
			},
			selectItem (item, index) {
				if (index !== 0) {
					this.addSong(new Song(item))
					this.$refs.topTip.show()
				}
			},
			selectSearch () {
				this.$refs.topTip.show();
				this.saveSearch()
			},
			...mapActions([
				'addSong'
			])
		},
		components: {
			searchBox,
			Suggest,
			Switches,
			Scroll,
			songList,
			historyList,
			topTip
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.add-song{
		position: fixed;
		top: 0;
		bottom: 0;
		width: 100%;
		z-index: 200;
		background: @color-background;
		&.slider-enter-active, &.slider-leave-avtive{
			transition: all .3s;
		}
		&.slider-enter, &.slider-leave-to{
			transform: translate3d(100%, 0, 0);
		}	
		.header{
			position: relative;
			height: 44px;
			text-align: center;
			line-height: 44px;
			.title{
				font-size: @font-size-large;
				color: @color-text;
			}
			.close{
				position: absolute;
				top: 0;
				right: 8px;
				.icon-no{
					display: block;
					padding: 12px;
					font-size: 20px;
					color: @color-theme;
				}
			}
		}	
		.search-box-wrapper{
			margin: 20px;
		}
		.shortcut{
			.list-wrapper{
				position: absolute;
				top: 165px;
				bottom: 0;
				width: 100%;
				.list-scroll{
					height: 100%;
					overflow: hidden;
					.list-inner{
						padding: 20px 0;
					}
					.search-inner{
						padding: 20px;
					}
				}
			}
		}
		.search-result{
			position: fixed;
			top: 124px;
			bottom: 0;
			width: 100%;
		}
		.tip-title{
			text-align: center;
			padding: 18px 0;
			font-size: 0;
			.icon-ok{
				font-size: @font-size-medium;
				color: @color-theme;
				margin-right: 4px;
			}
			.text{
				font-size: @font-size-medium;
				color: @color-text
			}
		}
	}
</style>