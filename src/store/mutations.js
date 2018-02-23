import * as types from './mutation-types.js'

const mutations = {
	[types.SET_SINGER] (state, singer) {
		state.singer = singer
	},
	[types.SET_PLAYING] (state, flag) {
		state.playing = flag
	},
	[types.SET_FULLSCREEN] (state, flag) {
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST] (state, list) {
		state.playList = list 
	},
	[types.SET_SEQUENCELIST] (state, list) {
		state.sequenceList = list
	},
	[types.SET_CURRENTINDEX] (state, index) {
		state.currentIndex = index
	},
	[types.SET_MODE] (state, mode) {
		state.mode = mode
	},
	[types.SET_DISC] (state, item) {
		state.disc = item
	},
	[types.SET_TOPLIST] (state, list) {
		state.topList = list
	},
	[types.SET_SEARCHHISTORY] (state, history) {
		state.searchHistory = history
	},
	[types.SET_PLAYHISTORY] (state, history) {
		state.playHistory = history
	},
	[types.SET_LIKESONG] (state, likeSong) {
		state.likeSong = likeSong
	}
}

export default mutations