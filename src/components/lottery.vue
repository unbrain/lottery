<template>
  <div :class="$style.wrap">
    <ul :class="$style.svgContain">
      <li
        v-for="(item, index) in svgs"
        :key="index"
        :class="$style.svgwrap"
        ref="svg"
      >
        <svg
          :class="{[$style.svgactive]:item.active,[$style.icon]: true}"
          aria-hidden="true"
        >
          <use :xlink:href="item.url"></use>
        </svg>
      </li>
      <li :class="$style.start">
        <div
          v-if="!start"
          @click="play"
        >开始</div>
        <div
          v-else
          @click="stop"
        >停止</div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    startNum: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 50
    },
    direction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      svgs: [
        { url: "#icon-ningmeng", active: false },
        { url: "#icon-yumi", active: false },
        { url: "#icon-niuyouguo", active: false },
        { url: "#icon-niuyouguo", active: false },
        { url: "#icon-ningmeng", active: false },
        { url: "#icon-chelizi", active: false },
        { url: "#icon-kaixinguo", active: false },
        { url: "#icon-caihua", active: false },
        { url: "#icon-dacong", active: false }
      ],
      start: false,
      timer1: ''
    }
  },
  methods: {
    play() {
      this.start = true;
      let startNum = this.startNum
      let order = [0, 1, 2, 5, 8, 7, 6, 3];
      if (!this.direction) {
        order = order.slice(0, 1).concat(order.slice(1).reverse())
      }
      this.timer1 = setInterval(() => {
        let last = (startNum === 0) ? order[7] : order[startNum - 1];
        this.svgs[last].active = false;
        this.svgs[order[startNum]].active = true;

        startNum = (startNum < 7) ? startNum + 1 : 0;
      }, this.speed);
    },
    stop() {
      clearInterval(this.timer1);
      this.start = false;
    }
  },
  created() {
    // this.play();
  },
  beforeDestroy() {
    clearInterval(this.timer1);
  }
};
</script>

<style lang="postcss" module>
ul,
li {
  margin-block-start: 0;
  margin-block-end: 0;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  padding-inline-start: 0px;
  list-style: none;
}

.svgactive {
  transform: scale(1.1);
}

.svgwrap {
  padding: 10px;
}
.svgContain {
  display: flex;
  position: relative;
  justify-content: center;
  align-items: center;
  width: 210px;
  flex-wrap: wrap;
}
.wrap {
  display: flex;
  justify-content: center;
  align-items: center;
}
.start {
  position: absolute;
  background-color: #fff;
  padding: 10px;
}
.start > div {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  font-size: 16px;
  border: 1px solid #af8f6f;
}
.icon {
  width: 50px;
  height: 50px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
