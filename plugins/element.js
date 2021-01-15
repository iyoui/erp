import Vue from 'vue'
import {Button,Form,FormItem,Input, Container, Header ,Aside, Main, Menu, Submenu,
  MenuItem, MenuItemGroup, Breadcrumb, BreadcrumbItem, Card, Option, Select, Col,
Pagination, MessageBox, Tag, Collapse, Tree, Cascader, Alert,Tabs, TabPane} from "element-ui";
// import axios from "axios";
// import VueResource from 'vue-resource'
// import VueAxios from "vue-axios";
//在main.js中引用不会报错
Vue.use(Button)
Vue.use(FormItem)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Select)
Vue.use(Option)
Vue.use(Col)
Vue.use(Pagination)
Vue.use(Tag)
Vue.use(Collapse)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.prototype.$confirm = MessageBox.confirm
// Vue.use(VueResource)
// Vue.use(axios, VueAxios)
// axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
// Vue.prototype.$http = axios
