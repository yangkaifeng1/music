<template>
	<scroll class="suggest" 
			:data="searchList" 
			:pullup="pullup"
			:beforeScroll="beforeScroll"
			@scrollToEnd="searchMore"
			@beforeScrollStart="listScroll"
			ref="suggest"
	>
		<ul class="suggest-list">
			<li @click="selectItem(item)" v-for="item in searchList" class="suggest-item">
				<div class="icon">
					<i :class="getClass(item)"></i>
				</div>
				<div class="name">
					<p class="text" v-html="getContent(item)"></p>
				</div>
			</li>
			<loading v-show="hasMore"></loading>
		</ul>
		<div class="no-result-wrapper" v-show="!hasMore && !searchList.length">
			<no-result :title="title"></no-result>
		</div>
	</scroll>
</template>

<script>
	import {search} from 'api/search'
	import {ERR_OK} from 'api/config'
	import {createSong} from 'common/js/song'
	import {mapMutations, mapActions} from 'vuex'
	import Singer from 'common/js/singer'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import noResult from 'base/no-result/no-result'

	const TYPE_SINGER = 'singer'
 	const perpage = 20

	export default{
		props: {
			query: {
				type: String,
				default: ''
			},
			zhida: {
				type: Boolean,
				default: true
			}
		},
		data () {
			return {
				page: 1,
				searchList: [],
				pullup: true,
				hasMore: true,
				title: "找不到你想要的",
				beforeScroll: true
			}
		},
		methods: {
			refresh () {
				this.$refs.suggest.refresh()
			},
			listScroll () {
				this.$emit('listScroll')
			},
			selectItem (item) {
				if (item.type === TYPE_SINGER) {
					let singer = new Singer({
						id: item.singermid,
						name: item.singername
					})
					this.setSinger(singer)
					this.$router.push({
						path: `search/${item.singermid}`
					})
				} else {
					this.addSong(item)
				}
				this.$emit('select')
			},
			getClass (item) {
				if (item.type === TYPE_SINGER) {
					return 'icon-mine'
				}
				return 'icon-music'
			},
			getContent (item) {
				if (item.type === TYPE_SINGER) {
					return item.singername
				}
				return `${item.name}-${item.singer}`
			},
			_getSearch (query) {
				this.hasMore = true
				this.$refs.suggest.scrollTo(0,0)
				search(query, this.page, this.zhida, perpage).then((res) => {
					if (res.code === ERR_OK) {
						this.searchList = this._normalList(res.data)
						this._checkMore(res.data)
					}
				})
			},
			searchMore () {
				if (!this.hasMore) {
					return
				}
				this.page ++
				let zhida = false
				search(this.query, this.page, zhida, perpage).then((res) => {
					if (res.code === ERR_OK) {
						this.searchList = this.searchList.concat(this._normalList(res.data))
						console.log(this.searchList)

						this._checkMore(res.data)
					}
				})
			},
			_checkMore (data) {
				const song = data.song 
				if (!song.list.length || (song.curpage * perpage) >= song.totalnum ) {
					this.hasMore = false
				}
			},
			_normalList (data) {
				let ret = []
				if (data.zhida && data.zhida.singerid) {
					ret.push({...data.zhida, ...{type: TYPE_SINGER}})
				}
				if (data.song) {
					let arr = this._normalSong(data.song.list)
					ret = ret.concat(arr)
				}
				return ret
			},
			_normalSong (data) {
				let ret = []
				data.forEach((item) => {
					if (item.songid && item.albumid) {
						ret.push(createSong(item))
					}
				})
				return ret
			},
			...mapMutations({
				setSinger: 'SET_SINGER'
			}),
			...mapActions([
				'addSong'
			])
		},
		watch: {
			query (newQuery) {
				this._getSearch(newQuery)
			}
		},
		components: {
			Scroll,
			Loading,
			noResult
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.suggest{
		height: 100%;
		overflow: hidden;
		.suggest-list{
			padding: 0 30px;
			.suggest-item{
				display: flex;
				align-items: center;
				padding-bottom: 20px;
			}
			.icon{
				flex: 0 0 30px;
				width: 30px;
				[class^="icon-"]{
					font-size: 14px;
					color: @color-text-d; 
				}
			}
			.name{
				flex: 1;
				font-style: @font-size-medium;
				color: @color-text-d;
				overflow: hidden;
				.text{
					.no-wrap();
				}
			}
		}
		.no-result-wrapper{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>