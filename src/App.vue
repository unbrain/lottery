<template>
  <div id="app">
    <!-- <pv :config="c"></pv> -->
    <p @click="$router.push('/pv')">拼图验证</p>
    <p @click="$router.push('/lottery')">抽奖九宫格</p>
    <p @click="$router.push('/slotwrap')">老虎机</p>
    <router-view></router-view>
  </div>
</template>

<script>
// import lottery from './components/lottery.vue';
import pv from './views/puzzleVerification';
export default {
  name: 'app',
  components: {
    // lottery,
    // slotwrap,
    pv
  },
  data() {
    return {
      c: {
        deviation: 3,// 两块拼图重合判断为成功时 x 轴最大偏移量
        puzzleFake: true,// 假拼图是否存在
        onSuccess(time, fn) {
          // 字符串可修改，注释将不显示提示信息
          fn(`成功了，用时${time}s`);
        },
        onFailed(fn) {
          fn('验证失败了。。');
        },
        onRobot(fn, cc) {
          fn('还是人类吗');
        },
        onMuchTry(fn) {
          fn('三次防刷');
        },
        onTimeout(time, fn) {
          fn(`用时${time}s,超过5s`);
        }
      }
    }
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
  max-width: 800px;
}
p {
  font-size: 16px;
  line-height: 32px;
}
</style>
