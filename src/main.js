import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from './axios'
import cookie from "./assets/js/cookie";
import Vant from 'vant';
import 'vant/lib/index.css';
import VueClipboard from 'vue-clipboard2'
import { format } from "./assets/js/tool";

Date.prototype.format = format

Vue.use(VueClipboard)

Vue.use(Vant);

import './assets/css/fontSize.css'
import './assets/css/reset.css'
import './assets/css/icomoon.css'

Vue.config.productionTip = false

Vue.prototype.$axios = axios; //把axios对象挂到vue的原型上
Vue.prototype.$cookie = cookie;

Vue.prototype.$back = function () {//返回上一页
    router.go(-1)
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
