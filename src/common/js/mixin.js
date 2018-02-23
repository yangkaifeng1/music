import {playmode}  from 'common/js/config'
import {mapGetters, mapMutations, mapActions} from 'vuex'
import {shuffle} from 'common/js/util'

export const playlistMixin = {
	computed: {
		...mapGetters([
			'playList'
		])
	},
	mounted () {
		this.handlePlaylist(this.playList)
	},
	activated () {
		this.handlePlaylist(this.playList)
	},
	watch: {
		playList (newVal) {
			this.handlePlaylist(newVal)
		}
	},
	methods: {
		handlePlaylist () {
			throw new Error('components must implement handlePlaylist methods')
		}
	}
}

export const playerMixin = {
	computed: {
		iconMode () {
			return this.mode === playmode.sequence ? 'icon-sequence' : this.mode === playmode.loop ? 'icon-loop' : 'icon-random'
		},
		...mapGetters([
			'sequenceList',
			'currentSong',
			'playList',
			'currentIndex',
			'mode',
			'likeSong'
		])
	},
	methods: {
		toggleLike (song) {
			if (this.checkLike(song)) {
				this.deleteLikeList(song)
			} else {
				this.saveLikeList(song)
			}
		},
		getLikeIcon (song) {
			if (this.checkLike(song)) {
				return 'icon-like'
			} else {
				return 'icon-not-like'
			}
		},
		checkLike (song) {
			const index = this.likeSong.findIndex((item) => {
				return item.id === song.id
			})  
			return index > -1
		},
		modeChange () {
			let mode = (this.mode + 1) % 3
			this.setmode(mode)
			let list = null
			if (mode === playmode.random) {
				list = shuffle(this.sequenceList)
			} else {
				list = this.sequenceList
			}
			this.resetIndex(list)
			this.setPlaylist(list)
		},
		resetIndex (list) {
			let index = list.findIndex((item) => {
				return item.id === this.currentSong.id
			})
			this.setCurrentIndex(index)
		},
		...mapMutations({
			setCurrentIndex: 'SET_CURRENTINDEX',
			setplaying: 'SET_PLAYING',
			setmode: 'SET_MODE',
			setPlaylist: 'SET_PLAYLIST'
		}),
		...mapActions([
			'saveLikeList',
			'deleteLikeList'
		])
	}
}

export const searchMixin = {
	data () {
		return {
			query: ''
		}
	},
	computed: {
		...mapGetters([
			'searchHistory'
		])
	},
	methods: {
		addQuerry (key) {
			this.$refs.searchBox.setQuery(key)
		}, 
		blurInput () {
			this.$refs.searchBox.blur()
		},
		onQueryChange (query) {
			this.query = query
		},
		saveSearch () {
			this.insertHistory(this.query)
		}, 
		...mapActions([
			'insertHistory',
			'deleteHistory'
		])
	}
}