import Vue from 'vue';
import Axios from 'axios'
import App from './App.vue';
import plugin from './plugin'
import './rem';
import 'normalize.css';

Vue.prototype.$axios = Axios;
Vue.config.productionTip = false;
Vue.use(plugin);
new Vue({
  render: h => h(App),
}).$mount('#app');
