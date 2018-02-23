<template>
	<div class="search-box">
		<i class="icon-Search"></i>
		<input type="text" class="box" v-model="query" :placeholder="placeholder" ref="box">
		<i class="icon-dismiss" v-show="query" @click="clear"></i>
	</div>
</template>

<script>
	import {debounce} from 'common/js/util'

	const delay = 300

	export default {
		props: {
			placeholder: {
				type: String,
				default: '搜索歌曲、歌手'
			}
		},
		data () {
			return {
				query: ''
			}
		},
		methods: {
			blur () {
				this.$refs.box.blur()
			},
			setQuery (key) {
				this.query = key
			},
			clear () {
				this.query = ''
			}
		},
		created () {
			this.$watch('query', debounce((newQuery) => {
				this.$emit('query', newQuery)
			}, delay))
		}
	}	
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';

	.search-box{
		display: flex;
		align-items: center;
		width: 100%;
		box-sizing: border-box;
		padding: 0 6px;
		background: @color-highlight-background;
		height: 40px;
		border-radius: 6px;
		.icon-search{
			font-size: 24px;
			color: @color-background;
		}
		.box{
			flex: 1;
			margin: 0 5px;
			line-height: 18px;
			background: @color-highlight-background;
			color: @color-text;
			font-style: @font-size-medium;
			&::placeholder{
				color: @color-text-d;
			}
		}
		.icon-dismiss{
			font-size: 16px;
			color: @color-background;
		}
	}
</style>