<template>
	<div class="recommand" ref="recommand">
		<scroll ref="scroll" class="recommand-content" :data="discList">
			<div>
				<div class="slider-wrapper" v-if="recommands.length>0">
					<slider>
						<div v-for="item in recommands">
							<a :href="item.linkUrl">
								<img class="needsclick" :src="item.picUrl" @load="loadImage">
							</a>
						</div>
					</slider>
				</div>
				<div class="recommand-list">
					<h1 class="list-title">热门歌单推荐</h1>
					<ul>
						<li @click="selectItem(item)" v-for="item in discList" class="item">
							<div class="icon">
								<img v-lazy="item.cover" class="cover" width="60" height="60">
							</div>
							<div class="desc">
								<h2 class="username" v-html="item.username"></h2>
								<p class="title" v-html="item.title"></p>
							</div>
						</li>
					</ul>	
				</div>
			</div>
		</scroll>
		<router-view></router-view>
		<div class="loading-wrapper" v-show="!discList.length">
			<loading ></loading>
		</div>
	</div>
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import Slider from 'base/slider/slider'
	import {getRecommand, getDiscList} from 'api/recommand'
	import {ERR_OK} from 'api/config'
	import {playlistMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'

	export default {
		mixins: [playlistMixin],
		data () {
			return {
				recommands: [],
				discList: []
			}
		},
		created () {
			this._getRecommand()
			this._getDiscList()
		},
		methods: {
			selectItem (item) {
				this.$router.push({
					path: `/recommand/${item.content_id}`
				})
				this.setDisc(item)
			},
			handlePlaylist (playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''
				this.$refs.recommand.style.bottom = bottom
				this.$refs.scroll.refresh()
			},
			_getRecommand () {
				getRecommand().then((res) => {
					if (res.code === ERR_OK) {
						this.recommands = res.data.slider
					}
				})
			},
			_getDiscList () {
				getDiscList().then((res) => {
					if (res.code === ERR_OK) {
						this.discList = res.recomPlaylist.data.v_hot
					}
				})
			},
			loadImage () {
				if (!this.checkloaded) {
					this.$refs.scroll.refresh()
					this.checkloaded = true
				}
			},
			...mapMutations({
				setDisc: 'SET_DISC'
			})
		},
		components: {
			Slider,
			Scroll,
			Loading
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';

	.recommand{
		position: absolute;
		width: 100%;
		top: 88px;
		bottom: 0;
		.recommand-content{
			height: 100%;
			overflow: hidden;
			.slider-wrapper{
				position: relative;
				width: 100%;
				overflow: hidden;
			}
			.recommand-list{
				.list-title{
					height: 65px;
					line-height: 65px;
					text-align: center;
					font-size: @font-size-medium;
					color: @color-theme;
				}
				.item{
					display: flex;
					box-sizing: border-box;
					align-item: center;
					padding: 0 20px 20px 20px;
					.icon{
						flex: 0 0 60px;
						width: 60px;
						padding-right: 20px;
					}
					.desc{
						display: flex;
						flex-direction: column;
						justify-content: center;
						flex: 1;
						line-height: 20px;
						overflow: hidden;
						font-size: @font-size-medium;
						.username{
							margin-bottom: 10px;
							color: @color-text;
						}
						.title{
							color: @color-text-d;
						}
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