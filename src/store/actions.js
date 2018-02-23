import * as types from './mutation-types'
import {getSongResource, getSongContent} from 'api/songResource'
import {ERR_OK} from 'api/config'
import {shuffle} from 'common/js/util'
import {playmode} from 'common/js/config'
import {saveSearch, deleteSearch, clearSearch, saveHistory, saveLike, deleteLike} from 'common/js/cache'

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

export const selectPlay = function ({commit, state}, {list, index}) {
	if (state.mode === playmode.random) {
		let newList = shuffle(list)
		commit(types.SET_PLAYLIST, newList)
		index = findIndex(newList, list[index])
	} else{
		commit(types.SET_PLAYLIST, list)
	}
	commit(types.SET_CURRENTINDEX, index)
	commit(types.SET_SEQUENCELIST, list)
	commit(types.SET_FULLSCREEN, true)
	commit(types.SET_PLAYING, true)
}

export const randomPlay = function ({commit}, list) {
	commit(types.SET_MODE, playmode.random)
	let newList = shuffle(list)
	let item = newList[0]
	commit(types.SET_PLAYLIST, newList)
	commit(types.SET_SEQUENCELIST, list)
	commit(types.SET_CURRENTINDEX, 0)
	commit(types.SET_FULLSCREEN, true)
	commit(types.SET_PLAYING, true)
}

export const addSong = function ({commit, state}, song) {
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex

	let currentSong = playList[currentIndex]

	let fpIndex = findIndex(playList, song)

	currentIndex++
	playList.splice(currentIndex, 0, song)

	if (fpIndex > -1) {
		if (fpIndex > currentIndex) {
			playList.splice(fpIndex + 1, 1)
		} else {
			playList.splice(fpIndex, 1)
			currentIndex--
		}
	}

	let currentSIndex = findIndex(sequenceList, currentSong) + 1

	let fsIndex = findIndex(sequenceList, song)

	sequenceList.splice(currentSIndex, 0, song)

	if (fsIndex > -1) {
		if (fsIndex > currentSIndex) {
			sequenceList.splice(fsIndex + 1, 1)
		} else {
			sequenceList.splice(fsIndex, 1)
		}
	}

	commit(types.SET_PLAYLIST, playList)
	commit(types.SET_SEQUENCELIST, sequenceList)
	commit(types.SET_CURRENTINDEX, currentIndex)
	commit(types.SET_FULLSCREEN,true)
	commit(types.SET_PLAYING, true)
} 

export const insertHistory = function ({commit}, query) {
	commit(types.SET_SEARCHHISTORY, saveSearch(query))
}

export const deleteHistory = function ({commit}, query) {
	commit(types.SET_SEARCHHISTORY, deleteSearch(query))
}

export const clearHistory = function ({commit}) {
	commit(types.SET_SEARCHHISTORY, clearSearch())
}

export const deleteSong = function ({commit, state}, song) {
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let index = state.currentIndex

	let pIndex = findIndex(playList, song)
	playList.splice(pIndex, 1)

	let sIndex = findIndex(sequenceList, song)
	sequenceList.splice(sIndex, 1)

	if (index > pIndex || index === playList.length) {
	    index--
	}

	commit(types.SET_PLAYLIST, playList)
	commit(types.SET_SEQUENCELIST, sequenceList)
	commit(types.SET_CURRENTINDEX, index)

	const playingState = playList.length > 0
	commit(types.SET_PLAYING, playingState)
}

export const deleteList = function ({commit}) {
	commit(types.SET_PLAYLIST, [])
	commit(types.SET_SEQUENCELIST, [])
	commit(types.SET_PLAYING, false)
	commit(types.SET_CURRENTINDEX, -1)
}

export const savePlayHistory = function ({commit}, song){
	commit(types.SET_PLAYHISTORY, saveHistory(song))
} 

export const saveLikeList = function ({commit}, song) {
	commit(types.SET_LIKESONG, saveLike(song))
}	

export const deleteLikeList = function ({commit}, song) {
	commit(types.SET_LIKESONG, deleteLike(song))
}