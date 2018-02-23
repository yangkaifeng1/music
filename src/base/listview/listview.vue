<template>
	<scroll 
		:data="data" 
		class="listview" 
		ref="listView"
		:listenscroll="listenscroll"
		:probeType="probeType"
		@scroll="scroll">
		<ul>
			<li v-for="item in data" class="list-group" ref="listGroup">
				<h2 class="title">{{item.title}}</h2>
				<ul>
					<li @click="selectItem(item)" v-for="item in item.items" class="list-group-item">
						<img v-lazy="item.avatar" width="50" height="50" class="avatar">
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		<div class="list-shortcut">
			<ul>
				<li class="item" 
					:class="{'current':currentIndex===index}"
					v-for="(item, index) in shortcutList" 
					@touchstart="touchstartShortcart"
					@touchmove.stop.prevent="touchmoveShortcart" 
					:data-index="index">
					{{item}}
				</li>
			</ul>
		</div>
		<div class="fixed-title" v-show="fixedTitle" ref="fixed">
			<h1 class="title">{{fixedTitle}}</h1>
		</div>
		<div class="loading-container" v-show="!data.length">
			<loading></loading>
		</div>
	</scroll>
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
	import {getData} from 'common/js/dom'

	const ANCHOR_HEIGHT = 16
	const TITLE_HEIGHT = 30

	export default {
		created () {
			this.touch = {}
			this.listenscroll = true
			this.listHeight = []
			this.probeType = 3
		},
		props: {
			data: {
				type: Array,
				default: []
			}
		},
		data () {
			return {
				scrollY: -1,
				currentIndex: 0,
				diff: -1
			}
		},
		computed: {
			shortcutList () {
				return this.data.map((group) => {
					return group.title.substr(0, 1)
				})
			},
			fixedTitle () {
				if (this.scrollY > 0) {
					return ''
				}
				return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
			}
		},
		methods: {
			refresh () {
				this.$refs.listView.refresh()
			},
			selectItem (item) {
				this.$emit('select', item)
			},
			touchstartShortcart (event) {
				let index = getData(event.target, 'index')
				let firstTouch = event.touches[0]
				this.touch.y1 = firstTouch.pageY
				this.touch.index = index
				this._scrollTo(index)
			},
			touchmoveShortcart (event) {
				let firstTouch = event.touches[0]
				this.touch.y2 = firstTouch.pageY
				let delta = (this.touch.y2-this.touch.y1) / ANCHOR_HEIGHT | 0
				let index = parseInt(this.touch.index) + delta
				this._scrollTo(index)
			},
			scroll (pos) {
				this.scrollY = pos.y
			},
			_scrollTo (index) {
				this.scrollY = -this.listHeight[index]
				this.$refs.listView.scrollToElement(this.$refs.listGroup[index], 0)
			},
			_calculateHeight () {
				this.listHeight = []
				const list = this.$refs.listGroup
				let height = 0
				this.listHeight.push(height)
				for (var i = 0; i < list.length; i++) {
					var item = list[i]
					height += item.clientHeight
					this.listHeight.push(height)
				}
			}
		},
		watch: {
			data () {
				setTimeout(() => {
					this._calculateHeight()
				}, 20)
			},
			scrollY (newY) {
				let listHeight = this.listHeight
				if (newY>0) {
					this.currentIndex = 0
					return
				}
				for (var i = 0; i < listHeight.length; i++) {
					let item1 = listHeight[i]
					let item2 = listHeight[i+1]
					if (-newY >= item1 && -newY < item2) {
						this.currentIndex = i
						this.diff = item2 + newY
						return
					}
				}
				this.currentIndex = listHeight.length - 2
			},
			diff (newval) {
				let fixedTop = (newval  > 0 && newval < TITLE_HEIGHT) ? newval - TITLE_HEIGHT : 0
				if (this.fixedTop === fixedTop) {
		            return
		        }
		        this.fixedTop = fixedTop
				this.$refs.fixed.style.transform = `translate3d(0, ${fixedTop}px, 0)`
			}
		},
		components: {
			Scroll,
			Loading
		}
	} 
</script>

<style lang="less" scoped>
	@import '~common/style/variable';

	.listview{
		position: relative;
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: @color-background;
		.list-group{
			padding-bottom: 30px;
			.title{
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: @font-size-small;
				color: @color-text-l;
				background: @color-highlight-background;
			}
			.list-group-item{
				display: flex;
				align-items: center;
				padding: 20px 0 0 30px;
				.avatar{
					width: 50px;
					height: 50px;
					border-radius: 50%;
				}
				.name{
					margin-left: 20px;
					color: @color-text-l;
					font-size: @font-size-medium
				}
			}
		}
		.list-shortcut{
			position: absolute;
			z-index: 30;
			right: 0;
			top: 50%;
			transform: translateY(-50%);
			width: 20px;
			padding: 10px 0;
			border-radius: 10px;
			text-align: center;
			background: @color-background-d;
			font-family: Helvetica;
			.item{
				padding: 2px;
				line-height: 1;
				color: @color-text-l;
				font-size: @font-size-small-s;
				&.current{
					color: @color-theme;
				}
			}
		}
		.fixed-title{
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			.title{
				height: 30px;
				line-height: 30px;
				padding-left: 20px;
				font-size: @font-size-small;
				color: @color-text-l;
				background: @color-highlight-background;
			}
		}
		.loading-container{
			position: absolute;
			width: 100%;
			top: 50%;
			transform: translateY(-50%);
		}
	}
</style>