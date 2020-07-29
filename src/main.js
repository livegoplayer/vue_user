import Vue from 'vue'
import App from './App.vue'
import router from './router/index.js'
import axios from 'axios'
import store from './store/store' // 引入全局store
import { post, get, getFrom, upExcel } from './assets/js/axios'
import ElementUI from 'element-ui'

Vue.use(ElementUI)
Vue.prototype.$get = get
Vue.prototype.$get_from = getFrom
Vue.prototype.$up_excel = upExcel
Vue.prototype.$post = post
Vue.prototype.$http = axios
Vue.prototype.axios = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
