<template>
  <div id="app">
    <lottery :start-num="3"></lottery>
  </div>
</template>

<script>
import lottery from './components/lottery.vue';
export default {
  name: 'app',
  components: {
    'lottery': lottery
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
