<template>
  <div id="app">
    <!-- <lottery
      :start-num="2"
      :direction="false"
    ></lottery> -->
    <!-- <slotwrap></slotwrap> -->
    <puzzle></puzzle>
  </div>
</template>

<script>
// import lottery from './components/lottery.vue';
// import slotwrap from './components/slotwrap';
import puzzle from '@/components/puzzleVerification';
export default {
  name: 'app',
  components: {
    // lottery,
    // slotwrap,
    puzzle
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
