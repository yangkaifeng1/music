 <template>
	<div class="player" v-show="playList.length>0">
		<transition 
			name="normal"
			@enter="enter"
			@after-enter="afterenter"
			@leave="leave"
			@after-leave="afterleave">
			<div class="normal-player" v-show="fullScreen">
				<div class="background">
					<img width="100%" height="100%" :src="currentSong.image">
				</div>
				<div class="top">
					<div class="back">
						<i class="icon-back" @click="back"></i>
					</div>
					<h1 class="title" v-html="currentSong.name"></h1>
					<h2 class="subtitle" v-html="currentSong.singer"></h2>
				</div>
				<div class="middle" 
					ref="middle"
					@touchstart.prevent="middleStart"
					@touchmove.prevent="middleMove"
					@touchend="middleEnd">
					<div class="middle-l" ref="middleL">
						<div class="cd-wrapper" ref="cdWrapper">
							<div class="cd" :class="cdRotate">
								<img class="image" :src="currentSong.image">
							</div>
						</div>
						<div class="playing-lyric-wrapper">
							<p class="playing-lyric">{{playingLyric}}</p>
						</div>
					</div>
					<scroll class="middle-r" :data="currentLyric&&currentLyric.lines" ref="lineScroll">
						<div class="lyric-wrapper">
							<div v-if="currentLyric">
								<p 
								v-for="(item,index) in currentLyric.lines" 
								class="text"
								:class="{'current': currentLine ===index}"
								ref="lineLyric">
									{{item.txt}}
								</p>
							</div>
							<div class="pure-music" v-show="isPureMusic">
								<p>{{pureMusicLyric}}</p>
							</div>
						</div>
					</scroll>
				</div>
				<div class="bottom">
					<div class="dot-wrapper">
						<span class="dot" :class="{'active': currentShow==='cd'}"></span>
						<span class="dot" :class="{'active': currentShow==='lyric'}"></span>
					</div>
					<div class="progress-wrapper">
						<div class="time time-l">{{format(currentTime)}}</div>
						<div class="progress-bar-wrapper">
							<progress-bar @percentChange="percentChange" :percent="percent"></progress-bar>
						</div>
						<div class="time time-r">{{format(currentSong.duration)}}</div>
					</div>
					<div class="operators">
						<div class="icon i-left">
							<i :class="iconMode" @click="modeChange"></i>
						</div>
						<div class="icon i-left" :class="disableCls">
							<i class="icon-prev" @click="prev"></i>
						</div>
						<div class="icon i-center" :class="disableCls">
							<i @click="togglePlaying" :class="playIcon"></i>
						</div>
						<div class="icon i-right" :class="disableCls">
							<i class="icon-next" @click="next"></i>
						</div>
						<div class="icon i-right" @click="toggleLike(currentSong)">
							<i :class="getLikeIcon(currentSong)"></i>
						</div>
					</div>
				</div>
			</div>
		</transition>
		<transition name="mini">
			<div class="mini-player" v-show="!fullScreen" @click="open">
			<div class="icon">
				<img width="40" height="40" :src="currentSong.image" :class="cdRotate">
			</div>
			<div class="text">
				<h2 class="name" v-html="currentSong.name"></h2>
				<p class="desc" v-html="currentSong.singer"></p>
			</div>
			<div class="control">
				<progress-circle :percent="percent" :radius="radius">
					<i @click.stop="togglePlaying" class="icons icon-mini"  :class="miniIcon"></i>
				</progress-circle>
			</div>
			<div class="control">
				<i class="icon-playlist icons" @click.stop="showList"></i>
			</div>
			</div>
		</transition>
		<playlist ref="playList"></playlist>
		<top-tip :delay="delay" ref="topTip">
			<div class="top-title">
				<p>该歌曲需要付费才能听</p>
			</div>
		</top-tip>
		<audio ref="audio" @error="error" @timeupdate="timeupdate"
           @ended="end" @pause="paused" @play="ready" id="audio"></audio>
	</div>
</template>

<script>
	import progressCircle from 'base/progress-circle/progress-circle'
	import progressBar from 'base/progress-bar/progress-bar'
	import {mapGetters, mapMutations, mapActions} from 'vuex'
	import animations from 'create-keyframe-animation'
	import {prefixStyle} from 'common/js/dom'
	import {playmode} from 'common/js/config'
	import {playerMixin} from 'common/js/mixin'
	import  ParserLyric from 'lyric-parser'
	import Scroll from 'base/scroll/scroll'
	import Playlist from 'components/playlist/playlist'
	import topTip from 'base/top-tip/top-tip'


	const transform = prefixStyle('transform')
	const transitionDuration = prefixStyle('transitionDuration')

	const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g

	export default {
		mixins: [playerMixin],
		data () {
			return {
				songReady: false,
				currentTime: 0,
				radius: 30,
				currentLyric: null,
				currentLine: 0,
				currentShow: 'cd',
				playingLyric: '',
				isPureMusic: false,
        		pureMusicLyric: '',
        		delay: 2000
			}
		},
		created () {
			this.touch = {}
		},
		computed: {
			percent () {
				return this.currentTime / this.currentSong.duration
			},
			playIcon () {
				return this.playing ? 'icon-pause' : 'icon-play' 
			},
			miniIcon () {
				return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
			},
			cdRotate () {
				return this.playing ? 'play' : 'play pause' 
			},
			disableCls () {
				return this.songReady ? '' : 'disable'
			},
			...mapGetters([
				'fullScreen',
				'playing'
			])
		},
		methods: {
			paused() {
		        this.setplaying(false)
		        if (this.currentLyric) {
		          this.currentLyric.stop()
		        }
		    },
			showList () {
				this.$refs.playList.show()
			},
			enter (el, done) {
				let {x, y, scale} = this._getPosAndScale()
				let animation = {
					0: {
						transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
					},
					60: {
						transform: 'translate3d(0, 0, 0) scale(1.1)'
					},
					100: {
						transform: 'translate3d(0, 0, 0) scale(1)'
					}
				}
				animations.registerAnimation({
					name: 'move',
					animation,
					presets: {
						duration: 400,
						easing: 'linear'
					}
				})
				animations.runAnimation(this.$refs.cdWrapper, 'move', done)
			},
			afterenter () {
				animations.unregisterAnimation('move')
				this.$refs.cdWrapper.style.animation = ''
			},
			leave (el, done) {
				this.$refs.cdWrapper.style.transition = 'all .4s'
				let {x, y, scale} = this._getPosAndScale()
				this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
				const timer = setTimeout(done, 400)
				this.$refs.cdWrapper.addEventListener('transitionend', () => {
					clearTimeout(timer)
					done()
				})
			},
			afterleave () {
				this.$refs.cdWrapper.style.transition = ''
				this.$refs.cdWrapper.style[transform] = ''
			},
			togglePlaying () {
				if (!this.songReady) {
					return
				}
				this.setplaying(!this.playing)
				if (this.currentLyric) {
					this.currentLyric.togglePlay()
				}
			},	
			_getPosAndScale () {
				const targetWidth = 40
				const paddingLeft = 40
				const paddingBottom = 30
				const paddingTop = 80
				const width = window.innerWidth * 0.8
				const scale = targetWidth/width
				const x = -(window.innerWidth/2 - paddingLeft) 
				const y = window.innerHeight-width/2-paddingBottom-paddingTop
				return {x, y, scale}
			},
			back () {
				this.setFullscreen(false)
			}, 
			open () {
				this.setFullscreen(true)
			},
			prev () {
				if (!this.songReady) {
					return
				}

				if (this.playList.length === 1) {
					this.loop()
					return
				} else {
					let index = this.currentIndex - 1
					if (index === -1) {
						index = this.playList.length - 1 
					}
					this.setCurrentIndex(index)

					if (!this.playing) {
						this.togglePlaying()
					}
				}
			},
			next () {
				if (!this.songReady) {
					return
				}

				if (this.playList.length === 1) {
					this.loop()
					return
				} else{
					let index = this.currentIndex + 1
					if (index === this.playList.length) {
						index = 0
					}
					this.setCurrentIndex(index)

					if (!this.playing) {
						this.togglePlaying()
					}
				}
			},
			end () {
				this.currentTime = 0
				if (this.mode === playmode.loop) {
					this.loop()
				} else {
					this.next()
				}
			},
			loop () {
				this.$refs.audio.currentTime = 0
				this.$refs.audio.play()
				this.setplaying(true)
				if (this.currentLyric) {
					this.currentLyric.seek(0)
				}
			},
			ready () {
				clearTimeout(this.timer)
				this.songReady = true
				this.canLyricPlay = true
	        	
				this.savePlayHistory(this.currentSong)
				if (this.currentLyric && !this.isPureMusic) {
		        	this.currentLyric.seek(this.currentTime * 1000)
		        }
			},
			error () {
				clearTimeout(this.timer)
				this.songReady = true
			},
			timeupdate (e) {
				this.currentTime = e.target.currentTime
			},
			percentChange (percent) {
				const currentTime = this.currentSong.duration * percent
				this.currentTime = this.$refs.audio.currentTime = currentTime
				if (this.currentLyric) {
					this.currentLyric.seek(currentTime * 1000)
				}
				if (!this.playing) {
					this.togglePlaying()
				}
			},
			format (interval) {
				interval = interval | 0
				const minute = interval / 60 | 0
				const second = this._pad(interval % 60) 
				return `${minute}:${second}`
			},
			getLyric () {
				this.currentSong.getLyric().then((lyric) => {
					if (this.currentSong.lyric !== lyric) {
		            	return
		        	}
					this.currentLyric = new ParserLyric(lyric, this.handleLyric)
					console.log(this.currentLyric)
					this.isPureMusic = !this.currentLyric.lines.length
					if (this.isPureMusic) {
						this.pureMusicLyric = this.currentLyric.lrc.replace(timeExp, '').trim()
						this.playingLyric = this.pureMusicLyric
					} else {
						if (this.playing && this.canLyricPlay) {
				            this.currentLyric.seek(this.currentTime * 1000)
				        }
					}
				}).catch(() => {
					console.log('11')
					this.currentLyric = null
					this.playingLyric = ''
					this.currentLine = 0
				})
			},
			handleLyric ({lineNum, txt}) {
				if (!this.$refs.lineLyric) {
					return
				}
				this.currentLine = lineNum
				if (lineNum > 5) {
					let el = this.$refs.lineLyric[lineNum-5]
					this.$refs.lineScroll.scrollToElement(el, 1000)
				} else {
					this.$refs.lineScroll.scrollTo(0, 0, 1000)
				}
				this.playingLyric = txt
			},
			middleStart (e) {
				this.touch.touchIint =true			
				this.touch.moved = false
				const touch = e.touches[0]
				this.touch.startX = touch.pageX
				this.touch.startY = touch.pageY
			},
			middleMove (e) {
				if (!this.touch.touchIint) {
					return
				}
				const touch = e.touches[0]
				const deltaX = touch.pageX -  this.touch.startX 
				const deltaY = touch.pageY -  this.touch.startY 
				if (Math.abs(deltaY) > Math.abs(deltaX)) {
					return
				}
				if (!this.touch.moved) {
					this.touch.moved = true
				}
				const left = this.currentShow === 'cd' ? 0 : -window.innerWidth  
				const offsetWidth = Math.min(0, Math.max(-window.innerWidth, deltaX + left))
				this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
				this.$refs.lineScroll.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
				this.$refs.lineScroll.$el.style[transitionDuration] = 0
				this.$refs.middleL.style.opacity = 1- this.touch.percent
				this.$refs.middleL.style[transitionDuration] = 0
			},
			middleEnd (e) {
				if (!this.touch.moved) {
					return
				}
				let offsetWidth
				let opacity
				if (this.currentShow === 'cd') {
					if (this.touch.percent > 0.1) {
						offsetWidth = -window.innerWidth
						this.currentShow = 'lyric'
						opacity = 0
					} else {
						offsetWidth = 0 
						opacity = 1
					}
				} else {
					if (this.touch.percent < 0.9) {
						offsetWidth = 0
						this.currentShow = 'cd'
						opacity = 1
					} else {
						offsetWidth = -window.innerWidth
						opacity = 0
					}
				}
				const time = 400
				this.$refs.lineScroll.$el.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
				this.$refs.lineScroll.$el.style[transitionDuration] =`${time}ms`
				this.$refs.middleL.style.opacity = opacity
				this.$refs.middleL.style[transitionDuration] = `${time}ms`
				this.touch.touchIint = false
			},
			_pad (num, n=2){
				let len = num.toString().length;
				while (len < n) {
					num = '0' + num;
					len++
				} 
				return num
			},
			autoPlay () {
				let audio = this.$refs.audio,

				play = function () {
					audio.play();
					document.removeEventListener("touchstart",play,false);
				};

				audio.play();

				document.addEventListener("WeixinJSBridgeReady",function() {
					play();
				},false);

				document.addEventListener('YixinJSBridgeReady',function() {
					play();
				},false);

				document.addEventListener("touchstart",play,false);
			},
			...mapMutations({
				setFullscreen: 'SET_FULLSCREEN'
			}),
			...mapActions([
				'savePlayHistory'
			])
		},
		watch: {
			currentSong(newSong, oldSong) {
		        if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
		        		this.$refs.topTip.show()
			        	return
			        }
		        this.songReady = false
		        this.canLyricPlay = false
		        if (this.currentLyric) {
		        	this.currentLyric.stop()
		          	// 重置为null
		        	this.currentLyric = null
		        	this.currentTime = 0
		        	this.playingLyric = ''
		        	this.currentLine = 0
		        }
		        this.$refs.audio.src = newSong.url
		        setTimeout(() => {
		        	this.autoPlay()
		        }, 1000)
		        // this.autoPlay()
		        // document.addEventListener('touchstart', function () {
		        //     (function() {
		        //         that.$refs.audio.play();
		        //     })()
		        // });
		        // this.$refs.audio.play()

		        // 若歌曲 5s 未播放，则认为超时，修改状态确保可以切换歌曲。
		        clearTimeout(this.timer)
		        this.timer = setTimeout(() => {
		          this.songReady = true
		        }, 5000)
		        this.getLyric()
		    },
			// currentSong (newSong, oldSong) {
			// 	if (!newSong.id || !newSong.url || newSong.id === oldSong.id) {
			// 		return
			// 	}
			// 	this.songReady = false
   //      this.canLyricPlay = false
			// 	if (this.currentLyric) {
   //        this.currentLyric.stop()
   //        // 重置为null
   //        this.currentLyric = null
   //        this.currentTime = 0
   //        this.playingLyric = ''
   //        this.currentLine = 0
   //      }
			// 	this.$refs.audio.src = newSong.url
			// 	alert(this.$refs.audio.src)
   //      this.$refs.audio.play()

			// 	clearTimeout(this.timer)
   //      this.timer = setTimeout(() => {
   //        this.songReady = true
   //      }, 5000)
   //      this.getLyric()
			// },
			playing (newPlaying) {
				if (!this.songReady) {
					return
				}
				const audio = this.$refs.audio
				this.$nextTick(() => {
					newPlaying ? this.autoPlay() : audio.pause() 
				})
			}
		},
		components: {
			progressBar,
			progressCircle,
			Scroll,
			Playlist,
			topTip
		}
	}
</script>

<style lang="less" scoped>
	@import '~common/style/variable.less';
	@import '~common/style/mixin.less';

	.player{
		.normal-player{
			position: fixed;
			top: 0;
			left: 0;
			bottom: 0;
			right: 0;
			z-index: 150;
			background: @color-background;
			.background{
				position: absolute;
				top: 0;
				left: 0;
				height: 100%;
				width: 100%;
				opacity: 0.6;
				filter: blur(20px);
				z-index: -1;
			}
			.top{
				position: relative;
				margin-bottom: 25px;
				.back{
					position: absolute;
					top: 0;
					left: 6px;
					z-index: 50;
					.icon-back{
						display: block;
						padding: 9px;
						font-size: @font-size-large-x;
						color: @color-theme;
						transform: rotate(-90deg);
					}
				}
				.title{
					width: 70%;
					margin: 0 auto;
					line-height: 40px;
					text-align: center;
					.no-wrap();
					font-size: @font-size-large;
					color: @color-text;
				}
				.subtitle{
					line-height: 20px;
					text-align: center;
					color: @color-text;
					font-size: @font-size-medium;
				}
			}
			.middle{
				position: fixed;
				width: 100%;
				top: 80px;
				bottom: 170px;
				white-space: nowrap;
				font-size: 0;
				.middle-l{
					display: inline-block;
					vertical-align: top;
					position: relative;
					width: 100%;
					height: 0;
					padding-top: 80%;
					.cd-wrapper{
						position: absolute;
						left: 10%;
						top: 0;
						width: 80%;
						height: 100%;
						.cd{
							width: 100%;
							height: 100%;
							box-sizing: border-box;
							border: 10px solid rgba(255, 255, 255, 0.1);
							border-radius: 50%;
							&.play{
								animation: rotate 20s linear infinite;
							}
							&.pause{
								animation-play-state: paused;
							}
							.image{
								position: absolute;
								top: 0;
								left: 0;
								width: 100%;
								height: 100%;
								border-radius: 50%;
							}
						}
					}
					.playing-lyric-wrapper{
						width: 80%;
						margin: 20px auto 0 auto;
						overflow: hidden;
						text-align: center;
						.playing-lyric{
							height: 20px;
							line-height: 20px;
							font-size: @font-size-medium;
							color: @color-text-l;
						}
					}
				}
				.middle-r{
					display: inline-block;
					vertical-align: top;
					width: 100%;
					height: 100%;
					overflow: hidden;
					.lyric-wrapper{
						width: 80%;
						margin: 0 auto;
						text-align: center;
						overflow: hidden;
						.text{
							line-height: 32px;
							color: @color-text-l;
							font-size: @font-size-medium;
							&.current{
								color: @color-text;
							}
						}
						.pure-music{
							padding-top: 50%;
							line-height: 32px;
							color: @color-text-l;
							font-size: @font-size-medium;
						}
					}
				}
			}
			.bottom{
				position: absolute;
				bottom: 30px;
				width: 100%;
				.dot-wrapper{
					text-align: center;
					font-size: 0;
					.dot{
						display: inline-block;
						vertical-align: middle;
						margin: 0 4px;
						width: 8px;
						height: 8px;
						border-radius: 50%;
						background: @color-text-l;
						&.active{
							width: 20px;
							border-radius: 5px;
							color: @color-text-ll;
						}
					}
				}
				.progress-wrapper{
					display: flex;
					align-items: center;
					width: 80%;
					margin: 0 auto;
					padding: 10px 0;
					.time{
						color: @color-text;
						font-size: @font-size-small;
						flex: 0 0 30px;
						width: 30px;
						line-height: 30px;
						&.time-l{
							text-align: left;
						}
						&.time-r{
							text-align: right;
						}
					}
					.progress-bar-wrapper{
						flex: 1;
					}
				}
				.operators{
					display: flex;
					align-items: center;
					.icon{
						flex: 1;
						color: @color-theme;
						&.disable{
	              			color: @color-theme-d;
						}
						i{
							font-size: 30px;
						}
					}
					.i-left{
						text-align: right;
					}
					.i-center{
						padding: 0 20px;
						text-align: center;
						i{
							font-size: 40px;
						}
					}
					.i-right{
						text-align: left;
					}
				}
			}
			&.normal-enter-active, &.normal-leave-active{
				transition: all .4s;
				.top, .bottom{
					transition: all .4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
				}
			}
			&.normal-enter, &.normal-leave-to{
				opacity: 0;
				.top{
					transform: translate3d(0, -100px, 0);
				}
				.bottom{
					transform: translate3d(0, 100px, 0);
				}
			}
		}
		.mini-player{
			position: fixed;
			display: flex;
			align-items: center;
			left: 0;
			bottom: 0;
			width: 100%;
			height: 60px;
			z-index: 180;
			background: @color-highlight-background;
			.icon{
				flex: 0 0 40px;
				width: 40px;
				padding: 0 10px 0 20px; 
				img{
					border-radius: 50%;
					&.play{
						animation: rotate 20s linear infinite
					}
					&.pause{
						animation-play-state: paused;
					}
				}
			}
			.text{
				display: flex;
				flex-direction: column;
				justify-contnet: center;
				flex: 1;
				line-height: 20px;
				overflow: hidden;
				.name{
					margin-bottom: 2px;
					.no-wrap();
					font-size: @font-size-medium;
					color: @color-text;
				}
				.desc{
					.no-wrap();
					font-size: @font-size-small;
					color: @color-text-d;
				}
			}
			.control{
				flex: 0 0 30px;
				width: 30px;
				padding: 0 10px;
				.icons{
					font-size: 30px;
					color: @color-theme-d;
				}
				.icon-mini{
					position: absolute;
					top: 0;
					left: 0
				}
			}
		}
		.top-title{
			text-align: center;
			padding: 18px 0;
			font-style: @font-size-medium;
			color: @color-text;
		}
	}

	@keyframes rotate{
		0%{
			transform: rotate(0deg);
		} 
		100%{
			transform: rotate(360deg);
		}
	}
</style>