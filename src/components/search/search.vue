<template>
	<div class="search">
		<div class="box-wrapper">
			<search-box ref="searchBox" @query="onQueryChange"></search-box>
		</div>
		<div class="shortcut-wrapper" v-show="!query" ref="shortcutWrapper">
			<scroll class="shortcut" :data="shortcut" ref="shortcut">
				<div>
					<div class="hot-key">
						<h1 class="title">热门搜素</h1>
						<ul>
							<li @click="addQuerry(item.k)" v-for="item in hotKey" class="item">
								<span>{{item.k}}</span>
							</li>
						</ul>
					</div>
					<div @click="confirmOperate" class="search-history" v-show="searchHistory.length">
						<h1 class="title">
							<span class="text">搜索历史</span>
							<span class="clear">
								<i class="icon-clear"></i>
							</span>
						</h1>
						<history-list :searches="searchHistory" @select="addQuerry" @deleteOne="deleteHistory"></history-list>
					</div>
				</div>
			</scroll>
		</div>
		
		<div class="suggest-wrapper" v-show="query" ref="suggestWrapper">
			<suggest @select="saveSearch" :query="query" @listScroll="blurInput" ref="suggest"></suggest>
		</div>
		<confirm ref="confirm" @confirm="clearHistory" text="是否清空搜索历史"></confirm>
		<router-view></router-view>
	</div>
</template>

<script>
	import searchBox from 'base/search-box/search-box'
	import Suggest from 'components/suggest/suggest'
	import historyList from 'base/history-list/history-list'
	import Confirm from 'base/confirm/confirm'
	import Scroll from 'base/scroll/scroll'
 	import {getHot} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {mapActions, mapGetters} from 'vuex'
	import {playlistMixin, searchMixin} from 'common/js/mixin'

	export default {
		mixins:[playlistMixin, searchMixin],
		data () {
			return {
				hotKey: []
			}
		},
		created () {
			this._getHot()
		},
		computed: {
			shortcut () {
				return this.hotKey.concat(this.searchHistory)
			}
		},
		methods: {
			handlePlaylist (playlist) {
				const bottom = playlist.length > 0 ? '60px' : ''

				this.$refs.shortcutWrapper.style.bottom = bottom
				this.$refs.shortcut.refresh()

				this.$refs.suggestWrapper.style.bottom = bottom
				this.$refs.suggest.refresh()
			},
			confirmOperate () {
				this.$refs.confirm.show()
			},
			_getHot () {
				getHot().then((res) => {
					if (res.code === ERR_OK) {
						this.hotKey = res.data.hotkey.slice(0, 10)
					}
				})
			},
			...mapActions([
				'clearHistory'
			])
		},
		watch: {
			query (newVal) {
				if (!newVal) {
					setTimeout(() => {
						this.$refs.shortcut.refresh()
					}, 20)
				}
			}
		},
		components: {
			searchBox,
			Suggest,
			historyList,
			Confirm,
			Scroll
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.search{
		.box-wrapper{
			margin: 20px; 
		}
		.shortcut-wrapper{
			position: fixed;
			top: 178px;
			bottom: 0;
			width: 100%;
			.shortcut{
				height: 100%;
				overflow: hidden;
				.hot-key{
					margin: 0 20px 20px 20px;
					.title{
						margin-bottom: 20px;
						font-size: @font-size-medium;
						color: @color-text-l;
					}
					.item{
						display: inline-block;
						padding: 5px 10px;
						margin: 0 15px 10px 0;
						border-radius: 6px;
						background: @color-highlight-background;
						font-size: @font-size-medium;
						color: @color-text-d;
					}
				}
				.search-history{
					position: relative;
					margin: 0 20px;
					.title{
						display: flex;
						align-items: center;
						height: 40px;
						font-size: @font-size-medium;
						color: @color-text-l;
						.text{
							flex: 1
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
			}
		}
		.suggest-wrapper{
			position: fixed;
			top: 178px;
			bottom: 0;
			width: 100%;
		}
	}
</style>