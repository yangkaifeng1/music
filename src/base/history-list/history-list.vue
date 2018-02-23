<template>
	<div class="history-list">
		<transition-group name="list" tag="ul">
			<li :key="item" @click.stop="select(item)" class="search-item" v-for="item in searches">
				<span class="text">{{item}}</span>
				<span class="icon" @click.stop="deleteOne(item)">
					<i class="icon-close"></i>
				</span>
			</li>
		</transition-group>
	</div>
</template>

<script>
	export default {
		props: {
			searches: {
				type: Array,
				default: []
			}
		},
		methods: {
			select (item) {
				this.$emit('select', item)
			},
			deleteOne (item) {
				this.$emit('deleteOne', item)
			}
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.history-list{
		.search-item{
			display: flex;
			align-items: center;
			height: 40px;
			overflow: hidden;
			&.list-enter-avtive, &.list-leave-active{
				transition: all .2s;
			}
			&.list-enter, &.list-leave-to{
				height: 0;
			}
			.text{
				flex: 1;
				color: @color-text-l;
				font-size: @font-size-medium;
			}
			.icon{
				.extend-click();
				.icon-close{
					font-size: @font-size-small;
					color: @color-text-d;
				}
			}
		}
	}
</style>