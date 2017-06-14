// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'muse-ui/dist/theme-carbon.css'
Vue.use(MuseUI)

import axios from "axios"
Vue.prototype.$http = axios

import Actions from "@http"

// import Mock from "./mock"

Vue.config.productionTip = false

// Mock.mockApi();

/* eslint-disable no-new */
router.beforeEach((to, from, next) => {
  //NProgress.start();
  // if (to.path == '/login') {
  //   sessionStorage.removeItem('user');
  //   next()
  //   return;
  // }

  Actions.auth()
  	.then(res => {
  		let data = res.data;
      console.log(to.path);
  		if (data.code == 0 && to.path != '/login'){
        if (to.path == '/register' ){
          next();
        }
        else {
          next({ path: '/login' });
        }
        
  		}
  		else {
  			next();
  		}
  	})
  	.catch( error => {
      console.log("error:", error);
  		next({ path: '/login' });
  	})
})



new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
})
