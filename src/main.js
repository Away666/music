import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'
import { request } from './network/request';

import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'

// axios.defaults.baseURL = '/api'
// axios.defaults.timeout = 30000
// axios.defaults.withCredentials = true
// // axios请求拦截
// axios.interceptors.request.use(config => {
//   //为请求头对象，添加Token验证的Authorization字段
//   config.headers.Authorization = window.sessionStorage.getItem('token')
//   return config
// })

// 挂载axios
Vue.prototype.$http = request

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
