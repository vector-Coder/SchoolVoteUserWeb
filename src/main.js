// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false;

import URL from './util/UrlUtil'

Vue.prototype.$URL = URL;

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Vue.use(ElementUI);

import axios from 'axios'
axios.defaults.baseURL = 'http://219.229.222.122:825/DBN';
// axios.defaults.baseURL = "http://ssrx.jxau.edu.cn:8080/DBN";
// axios.defaults.baseURL = "http://localhost:8080/DBN";
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {App},
  template: '<App/>'
});
