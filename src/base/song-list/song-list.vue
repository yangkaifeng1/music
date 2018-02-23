<template>
	<div class="song-list">
		<ul>
			<li v-for="(song, index) in songs" class="item" @click="selectItem(song, index)">
				<div class="rank" v-show="rank">
					<div :class="getClass(index)" v-text="getText(index)"></div>
				</div>
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{getDesc(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import {ERR_OK} from 'api/config'

	export default{
		props: {
			songs: {
				type: Array,
				default: []
			},
			rank: {
				type: Boolean,
				default: false
			}
		},
		methods: {
			getDesc (song) {
				return `${song.singer} . ${song.album}`
			},
			selectItem (item, index) {
				this.$emit('select', item, index)
			},
			getClass (index) {
				if (index < 3) {
					return `icon icon${index}`
				} 

				return 'text'
			},
			getText (index) {
				if (index > 2) {
					return index + 1
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.song-list{
		.item{
			display: flex;
			align-items: center;
			box-sizing: border-box;
			height: 64px;
			font-size: @font-size-medium;
			.rank{
				flex: 0 0 25px;
				width: 25px;
				text-align: center;
				margin-left: 30px;
				.icon{
					display: inline-block;
					width: 25px;
					height: 24px;
					background-size: 25px 24px;
					&.icon0{
						.bg-image('../../base/song-list/img/first')
					}
					&.icon1{
						.bg-image('../../base/song-list/img/second')
					}
					&.icon2{
						.bg-image('../../base/song-list/img/third')
					}
				}
				.text{
					color: @color-theme;
					font-size: @font-size-large;
				}
			}
			.content{
				flex: 1;
				line-height: 20px;
				overflow: hidden;
				margin-left: 30px;
				.name{
					.no-wrap();
					color: @color-text;
				}
				.desc{
					.no-wrap();
					margin-top: 4px;
					color: @color-text-d;
				}
			}
		}
	}
</style>