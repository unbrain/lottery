import Vue from 'vue';
import Axios from 'axios';
import VueRouter from 'vue-router';
// import VConsole from 'vconsole';
import App from './App.vue';
import plugin from './plugin';
import 'normalize.css';
import router from './router';

// const vConsole = new VConsole();
Vue.prototype.$axios = Axios;
Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(plugin);
new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
