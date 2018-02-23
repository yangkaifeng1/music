<template>
	<div class="no-result">
		<i class="icon"></i>
		<p class="title">{{title}}</p>
	</div>
</template>

<script>
	export default {
		props: {
			title: {
				type: String,
				default: ''
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.no-result{
		text-align: center;
		.icon{
			display: inline-block;
			width: 86px;
			height: 90px;
			margin: 0 auto;
			.bg-image('../../base/no-result/img/no-result');
			background-size: 86px 90px;
		}
		.title{
			margin-top: 30px;
			font-size: @font-size-medium;
			color: @color-text-d;
		}
	}
</style>