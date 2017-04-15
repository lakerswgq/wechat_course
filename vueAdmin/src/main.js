import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import routes from './routes'
import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

import axios from "axios"
Vue.prototype.$http = axios

import AdminActions from "@http/admin"

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

NProgress.configure({ showSpinner: false });

const router = new VueRouter({
    mode: "history",
    base: "/admin/",
    routes: routes,
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  //   next()
  //   return;
  // }

  AdminActions.auth()
  	.then(res => {
  		let data = res.data;
  		if (data.code == 0 && to.path != '/login'){
  			next({ path: '/login' });
  		}
  		else {
  			next();
  		}
  	})
  	.catch( error => {
  		next({ path: '/login' });
  	})
})

router.afterEach(transition => {
NProgress.done();
});

new Vue({
    //el: '#app',
    //template: '<App/>',
    router,
    store,
    //components: { App }
    render: h => h(App)
}).$mount('#app')
