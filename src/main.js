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
import ZkTable from 'vue-table-with-tree-grid';
import quillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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
Vue.use(quillEditor)
Vue.filter('dateForm',function (original){
  const dt = new Date(original*1000)
  const y = dt.getFullYear();
  const m = (dt.getMonth() +1 + "").padStart(2,"0")
  const d = (dt.getDate() + "").padStart(2,"0")
  const hh = (dt.getHours() + "").padStart(2,"0")
  const mm = (dt.getMinutes() + "").padStart(2,"0")
  const ss = (dt.getSeconds() + "").padStart(2,"0")
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
