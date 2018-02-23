import storage from 'good-storage'

const SEARCH_KEY = '_search_'
const SEARCH_MAX_LEN = 15

const PLAYHISTORY_KEY = '_playHistory_'
const PLAYHISTORY_MAX_LEN = 200 

const LIKE_KEY = '_like_'
const LIKE_MAX_LEN = 200

function insertArray (list, query, compare, maxlen) {
	const index = list.findIndex(compare)
	if (index === 0) {
		return
	}

	if (index > 0) {
		list.splice(index, 1)
	}

	list.unshift(query)

	if (maxlen && list.length > maxlen) {
		list.pop()
	}
}

function deleteArray (list, compare) {
	let index = list.findIndex(compare)

	if (index > -1) {
		list.splice(index, 1)
	} 
}

export function saveSearch (query) {
	let searchList = storage.get(SEARCH_KEY, [])

	insertArray(searchList, query, (item) => {
		return item === query
	}, SEARCH_MAX_LEN)

	storage.set(SEARCH_KEY, searchList)

	return searchList
}

export function loadSearch() {
	return storage.get(SEARCH_KEY, [])
}

export function  deleteSearch(query) {
	const searches = storage.get(SEARCH_KEY, [])
	deleteArray(searches, (item) => {
		return item === query
	})
	storage.set(SEARCH_KEY, searches)
	return searches
}

export function clearSearch() {
	storage.remove(SEARCH_KEY)
	return []
}

export function saveHistory(song) {
	let playHistory = storage.get(PLAYHISTORY_KEY, [])

	insertArray(playHistory, song, (item) => {
		return item.mid === song.mid
	}, PLAYHISTORY_MAX_LEN)

	storage.set(PLAYHISTORY_KEY, playHistory)
	return playHistory
}

export function loadHistory() {
	return storage.get(PLAYHISTORY_KEY, [])
}

export function saveLike(song) {
	let likeList = storage.get(LIKE_KEY, [])

	insertArray(likeList, song, (item) => {
		return item.id === song.id
	}, LIKE_MAX_LEN)

	storage.set(LIKE_KEY, likeList)
	return likeList
} 

export function deleteLike(song) {
	let likeList = storage.get(LIKE_KEY, [])
	deleteArray(likeList, (item) => {
		return item.id === song.id
	})

	storage.set(LIKE_KEY, likeList)
	return likeList
}

export function loadLike() {
	return storage.get(LIKE_KEY, [])
}