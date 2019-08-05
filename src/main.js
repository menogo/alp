import Vue from 'vue'
import App from './App'

import http from './utils/http'
Vue.prototype.$http = http

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue(App)
app.$mount()
