import Vue from 'vue';
import Axios from 'axios'
import App from './App.vue';
import './rem';
import 'normalize.css';

Vue.prototype.$axios = Axios;
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
