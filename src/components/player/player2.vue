<template>
	<div class="player" v-show="playList.length">
		<button class="sss">sssss</button>
		<audio ref="audio" controls @canplay="ready" @error="error"></audio>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default {
		data () {
			return {
				songReady: false
			}
		},
		computed: {
			...mapGetters([
				'currentSong',
				'playList'
			])
		},
		methods: {
			load () {
		    	console.log('load')
			},
		    ready () {
		    	console.log('ready')

		    	// this.$refs.audio.play()
		    	// console.log('play')
		    	// this.$refs.audio.play()

		    },
		    error () {
		    	console.log('error')
		    }
		},
		watch: {
			currentSong (newSong) {
				this.$refs.audio.src = newSong.url
				console.log('src')
				// this.$refs.audio.preload = 'auto'
		    	this.$refs.audio.play() 
				// console.log('play')
		    	// console.log(this.$refs.audio.play)
			}
		}
	}	
</script>

<style lang="less" scoped>
	.player{
		position: fixed;
		top: 0;
		bottom: 200px;
		width: 100%;
		background: rgb(0, 0, 0);
		z-index: 10001;
		.sss{
			width: 30px;
			height: 20px;
			background: white;
		}
	}
</style>