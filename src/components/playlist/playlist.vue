<template>
	<transition name="list-fade">
		<div class="playlist" v-show="showflag" @click="hide">
			<div class="list-wrapper" @click.stop>
				<div class="list-header">
					<h1 class="title">
						<i class="icon" :class="iconMode" @click="modeChange"></i>
						<span class="text">{{modeText}}</span>
						<span class="clear" @click="showConfirm">
							<i class="icon-clear"></i>
						</span>
					</h1>
				</div>
				<scroll class="list-content" :data="sequenceList" ref="listContent">
					<transition-group name="item-fade" tag="ul">
						<li :key="item.id" ref="listItem" @click="selectItem(item, index)" class="item" v-for="(item, index) in sequenceList">
							<i class="current" :class="getCurrent(item)"></i>
							<span class="text">{{item.name}}</span>
							<span class="like" @click.stop="toggleLike(item)">
								<i :class="getLikeIcon(item)"></i>
							</span>
							<span class="delete" @click.stop="deleteOne(item)">
								<i class="icon-close"></i>
							</span>
						</li>
					</transition-group>
				</scroll>
				<div class="list-operate">
					<div class="add" @click="showAdd">
						<i class="icon-add"></i>
						<span class="text">添加歌曲到队列</span>
					</div>
				</div>
				<div class="list-close" @click="hide">
					<span>关闭</span>
				</div>
			</div>
			<confirm text="是否清空播放列表" confirmBtn="清空" ref="confirm" @confirm="clearList"></confirm>
			<add-song ref="addSong"></add-song>
		</div>
	</transition>
</template>

<script>
	import {mapGetters, mapMutations, mapActions} from 'vuex'
	import {playmode}  from 'common/js/config'
	import {playerMixin} from 'common/js/mixin'
	import Scroll from 'base/scroll/scroll'
	import Confirm from 'base/confirm/confirm'
	import addSong from 'components/add-song/add-song'
 
	export default {
		mixins: [playerMixin],
		data () {
			return {
				showflag: false
			}
		},
		computed: {
			modeText () {
				return this.mode === playmode.sequence ? '顺序播放' : this.mode === playmode.random ? '随机播放' : '单曲循环' 
			}
		},
		methods: {
			showAdd () {
				this.$refs.addSong.show()
			},
			showConfirm () {
				this.$refs.confirm.show()
			},
			clearList () {
				this.hide() 
				this.deleteList()
			},
			show () {
				this.showflag = true
				setTimeout(() => {
					this.$refs.listContent.refresh()
					this.scrollToCurrent(this.currentSong)
				}, 20)
			},
			hide () {
				this.showflag = false
			},
			getCurrent (item) {
				if (this.currentSong.id === item.id) {
					return 'icon-play'
				}
			},
			selectItem (item, index) {
				if (this.mode === playmode.random) {
					index = this.playList.findIndex((song) => {
						return song.id === item.id
					})
				}	
				this.setCurrentIndex(index)
				this.setplaying(true)
			},
			scrollToCurrent (song) {
				let findex = this.sequenceList.findIndex((item) => {
					return item.id === song.id
				})
				this.$refs.listContent.scrollToElement(this.$refs.listItem[findex], 300)
			},
			deleteOne (item) {
				this.deleteSong(item)
				if (!this.playList.length) {
					this.hide()
				}
			},
			...mapActions([
				'deleteSong',
				'deleteList'
			])
		},
		watch: {
			currentSong(newSong, oldSong) {
				if (!this.showflag || newSong.id === oldSong.id) {
					return
				}
				setTimeout(() => {
					this.scrollToCurrent(newSong)
				}, 20)
			}
		},
		components: {
			Scroll,
			Confirm,
			addSong
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.playlist{
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		background: @color-background-d;
		z-index: 200;
		&.list-fade-enter-active, &.list-fade-leave-active{
			transition: opacity .3s;
			.list-wrapper{
				transition: all .3s;
			}
		}
		&.list-fade-enter, &.list-fade-leave-to{
			opacity: 0;
			.list-wrapper{
				transform: translate3d(0, 100%, 0);
			}
		}
		.list-wrapper{
			position: absolute;
			bottom: 0;
			left: 0;
			width: 100%;
			background: @color-highlight-background;
			.list-header{
				position: relative;
				padding: 20px 30px 10px 20px;
				.title{
					display: flex;
					align-items: center;
					.icon{
						margin-right: 10px;
						font-size: 30px;
						color: @color-theme-d;
					}
					.text{
						flex: 1;
						font-size: @font-size-medium;
						color: @color-text-l;
					}
					.clear{
						.extend-click();
						.icon-clear{
							font-size: @font-size-medium;
							color: @color-text-d;
						}
					}
				}
			}
			.list-content{
				max-height: 240px;
				overflow: hidden;
				.item{
					display: flex;
					align-items: center;
					height: 40px;
					padding: 0 30px 0 20px;
					overflow: hidden;
					&.item-fade-enter-active, &.item-fade-leave-active{
						transition: all .2s
					}
					&.item-fade-enter, &.item-fade-leave-to{
						height: 0;
					}
					.current{
						flex: 0 0 20px;
						width: 20px;
						font-size: @font-size-small;
						color: @color-theme-d;
					}
					.text{
						flex: 1;
						font-size: @font-size-medium;
						color: @color-text-d;
						.no-wrap();
					}
					.like{
						.extend-click();
						margin-right: 15px;
						font-size: @font-size-small;
						color: @color-theme;
						.icon-like{
							color: @color-sub-theme;
						}
					}
					.delete{
						.extend-click();
						font-size: @font-size-small;
						color: @color-theme;
					}
				}
			}
			.list-operate{
				width: 140px;
				margin: 20px auto 30px auto;
				.add{
					display: flex;
					align-items: center;
					padding: 8px 16px;
					border: 1px solid @color-text-l;
					border-radius: 100px;
					color: @color-text-l;
					.icon-add{
						margin-right: 5px;
						font-size: @font-size-small-s;
					}
					.text{
						font-size: @font-size-small;
					}
				}
			}
			.list-close{
				text-align: center;
				line-height: 50px;
				background: @color-background;
				font-size: @font-size-medium-x;
				color: @color-text-l;
			}
		}
	}
</style>