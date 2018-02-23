import Vue from 'vue'
import Vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
import state from './state'
import mutations from './mutations'
import createLogger from 'vuex/dist/logger'

import 'common/style/index.less'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'producation' 

export default new Vuex.Store({
	actions,
	getters,
	state,
	mutations,
	strict: debug,
	plugins: debug ? [createLogger()] : []
})
