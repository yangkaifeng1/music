<template>
	<div class="progress-bar" ref="progressBar" @click="progressClick">
		<div class="bar-inner">
			<div class="progress" ref="progress"></div>
			<div 
				class="progress-btn-wrapper" 
				ref="progressBtn"
				@touchstart.prevent="touchstart"
				@touchmove.prevent="touchmove"
				@touchend="touchend">
				<div class="progress-btn"></div>
			</div>
		</div>
	</div>
</template>

<script>
	import {prefixStyle} from 'common/js/dom'

	const transform = prefixStyle('transform')
	const BTNWIDTH = 16	

	export default {
		props: {
			percent: Number,
			default: 0
		},
		created () {
			this.touch = {}
		},
		methods: {
			touchstart (e) {
				this.touch.init = true
				this.touch.startX = e.touches[0].pageX
				this.touch.left = this.$refs.progress.clientWidth
			},
			touchmove (e) {
				let deltaX = e.touches[0].pageX - this.touch.startX
				let offsetLeft =Math.min(this.$refs.progressBar.clientWidth - BTNWIDTH, Math.max(0, this.touch.left + deltaX)) 
				this._offset(offsetLeft)
			},
			touchend (e) {
				this.touch.init = false
				this._percentChange() 
			},
			progressClick (e) {
				let barLeft = this.$refs.progressBar.getBoundingClientRect()
				let offsetX = e.pageX - barLeft.left
				this._offset(offsetX)
				this._percentChange()
			},
			_percentChange () {
				const barwidth = this.$refs.progressBar.clientWidth - BTNWIDTH
				const percent = this.$refs.progress.clientWidth / barwidth
				this.$emit('percentChange', percent)
			},
			_offset (width) {
				this.$refs.progress.style.width = `${width}px`
				this.$refs.progressBtn.style[transform] = `translate3d(${width}px, 0, 0)`
			}
		},
		watch: {
			percent (newVal) {
				if (newVal >= 0 && !this.touch.init) {
					const width = this.$refs.progressBar.clientWidth - BTNWIDTH;
					const progressWidth = width * newVal;
					this._offset(progressWidth)
				}
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable';

	.progress-bar{
		height: 30px;
		.bar-inner{
			position: relative;
			top: 13px;
			height: 4px;
			background: rgba(0, 0, 0, 0.3);
			.progress{
				position: absolute;
				height: 100%;
				background: @color-theme;
			}
			.progress-btn-wrapper{
				position: absolute;
				left: -7px;
				top: -13px;
				width: 30px;
				height: 30px;
				.progress-btn{
					position: relative;
					top: 7px;
					left: 7px;
					box-sizing: border-box;
					width: 16px;
					height: 16px;
					border: 3px solid @color-text;
					border-radius: 50%;
					background: @color-theme;
				}
			}
		}
	}
</style>