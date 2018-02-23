<template>
	<div class="rank" ref="rank">
		<scroll class="topList" ref="topList" :data="rankList">
			<ul>
				<li @click="selectItem(item)" v-for="item in rankList" class="item">
					<div class="icon">
						<img v-lazy="item.picUrl" width="100" height="100">
					</div>
					<ul class="songlist">
						<li v-for="(song, index) in item.songList" class="song">
							<span>{{index + 1}}</span>
							<span>{{song.songname}}—{{song.singername}}</span>
						</li>
					</ul>
				</li>
			</ul>
		</scroll>
		<router-view></router-view>
		<div class="loading-wrapper" v-show="!rankList.length">
			<loading></loading>
		</div>
	</div>
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import {getRanklist} from 'api/rank'
	import {ERR_OK} from 'api/config'
	import {playlistMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'

	export default {
		mixins: [playlistMixin],
		data () {
			return {
				rankList: []
			}
		},
		created () {
			this._getRanklist()
		},
		methods: {
			handlePlaylist (playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.rank.style.bottom = bottom
				this.$refs.topList.refresh()
			},
			selectItem (item) {
				this.$router.push({
					path: `/rank/${item.id}`
				})
				this.setToplist(item)
			},
			_getRanklist () {
				getRanklist().then((res) => {
					if (res.code === ERR_OK) {
						this.rankList = res.data.topList
					}
				})
			},
			...mapMutations ({
				setToplist: 'SET_TOPLIST'
			})
		},
		components: {
			Scroll,
			Loading
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.rank{
		position: fixed;
		width: 100%;
		top: 88px;
		bottom: 0;
		.topList{
			height: 100%;
			overflow: hidden;
			.item{
				display: flex;
				margin: 0 20px;
				padding-top: 20px;
				height: 100px;
				&:last-child{
					padding-bottom: 20px;
				}
				.icon{
					flex: 0 0 100px;
					width: 100px;
					height: 100px;
				}
				.songlist{
					flex: 1;
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 0 20px;
					height: 100px;
					overflow: hidden;
					background: @color-highlight-background;
					color: @color-text-d;
					font-size: @font-size-small;
					.song{
						.no-wrap();
						line-height: 26px;
					}
				}
			}
		}
		.loading-wrapper{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>