<template>
	<div class="loading">
		<img src="./loading.gif" class="icon" width="24" height="24">
		<p class="title">{{title}}</p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: "稍微等等哦..."
			}
		}
	}
</script>

<style lang="less" scoped>
	@import "~common/style/variable.less";

	.loading{
		width: 100%;
		text-align: center;
		.title{
			line-height: 20px;
			font-size: @font-size-small;
			color: @color-text-l;
		}
	}
</style>