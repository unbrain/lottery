import Vue from 'vue';
import Router from 'vue-router';
import lottery from '@/views/lottery';
import pv from '@/views/puzzleVerification';
import slotwrap from '@/views/slotwrap';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/pv'
    },
    {
      path: '/lottery',
      name: 'lottery',
      component: lottery,
    },
    {
      path: '/slotwrap',
      name: 'slotwrap',
      component: slotwrap,
    },
    {
      path: '/pv',
      name: 'pv',
      component: pv,
    }
  ]
});
