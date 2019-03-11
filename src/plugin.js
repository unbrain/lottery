import Toast from './components/toast.vue';

export default {
  install(v) {
    const Vue = v;
    Vue.prototype.$toast = (msg, toastOptions) => {
      const Constructor = Vue.extend(Toast);
      const toast = new Constructor({
        propsData: toastOptions
      });
      toast.$slots.default = msg;
      toast.$mount();
      document.body.appendChild(toast.$el);
    };
  },
};
