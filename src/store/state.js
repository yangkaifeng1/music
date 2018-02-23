import {playmode} from 'common/js/config'
import {loadSearch, loadHistory, loadLike} from 'common/js/cache'

const state = {
	singer: {},
	playing: false,
	fullScreen: false,
	playList: [],
	sequenceList: [],
	currentIndex: -1,
	mode: playmode.sequence,
	songUrl: '',
	disc: {},
	topList: {},
	searchHistory: loadSearch(),
	playHistory: loadHistory(),
	likeSong: loadLike()
}

export default state