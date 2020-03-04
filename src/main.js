import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/reset.scss'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import http from "./../https"
import moment from "moment"
Vue.use(ElementUI);
Vue.config.productionTip = false;
Vue.use(http);

Vue.filter('formatTime',(v)=>{
  return moment(v).format("YYYY-MM-DD hh:mm:ss")
})
Vue.prototype.haveNotAuth = function () {
    alert('你没有该权限哦')
    return;
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
