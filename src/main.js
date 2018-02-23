// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import fastclick from 'fastclick'
import lazyload from 'vue-lazyload'
import store from './store'

import 'common/style/index.less'
/*eslint-disable no-unused-vars */ 
// import vconsole from 'vconsole'
// console.log('test')

fastclick.attach(document.body)

Vue.config.productionTip = false

Vue.use(lazyload, {
	loading: require('common/image/default.png')
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})
