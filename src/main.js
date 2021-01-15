import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUi from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import axios from "axios";
import {Message} from "element-ui";
import './assets/commom.css'
import elToast from "../plugins/elToast.js"
import inputAdd from "../plugins/inputAdd.js"
import formCheck from "../plugins/formCheck.js"
import settingBtn from "../plugins/settingBtn.js";
import ZkTable from 'vue-table-with-tree-grid'
axios.defaults.baseURL = 'http://timemeetyou.com:8889/api/private/v1/'
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token')
  return config
})
Vue.prototype.$http = axios
// Vue.prototype.$https = axios
Vue.prototype.$msg = Message
Vue.use(ElementUi)
Vue.use(elToast)
Vue.use(inputAdd)
Vue.use(formCheck)
Vue.use(settingBtn)
Vue.component('ZkTable',ZkTable)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
