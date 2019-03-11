<template>
  <div :class="$style.wrap">
    <ul :class="$style.svgContain">
      <li
        v-for="(item, index) in svgIcons"
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
        <div v-else>抽奖中</div>
      </li>
    </ul>
    <div>还有{{count}}次机会</div>
  </div>
</template>

<script>
/**
 * starNum 开始位置左上角为 0
 * speed 速度
 * direction 方向默认为真顺时针
 */
export default {
  props: {
    startNum: {
      type: Number,
      default: 0
    },
    speed: {
      type: Number,
      default: 100
    },
    direction: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      svgIcons: [
        { url: "#icon-ningmeng", active: false },
        { url: "#icon-yumi", active: false },
        { url: "#icon-niuyouguo", active: false },
        { url: "#icon-qiezi", active: false },
        { url: "#icon-ningmeng", active: false },
        { url: "#icon-chelizi", active: false },
        { url: "#icon-kaixinguo", active: false },
        { url: "#icon-caihua", active: false },
        { url: "#icon-dacong", active: false }
      ],
      start: false, // 图标切换
      timer1: '',
      currentIndex: 0,
      stopIndex: 99,
      currentSpeed: 0,
      order: [0, 1, 2, 5, 8, 7, 6, 3],
      count: 1 // 抽奖次数
    }
  },
  methods: {
    play() {
      if (this.count) {
        this.getStopNum();
        this.start = true;
        this.timer1 = this.playDetails(this.currentSpeed)
      } else {
        alert('没有机会啦！！！')
      }
    },
    stop(num) {
      setTimeout(() => {
        clearInterval(this.timer1);
        this.timer1 = this.playDetails(this.currentSpeed * 2);
      }, 2000);
      setTimeout(() => {
        clearInterval(this.timer1);
        this.timer1 = this.playDetails(this.currentSpeed * 4, true);
      }, 2000);
    },
    /**
     * speed 速度
     * stop 是否停止，默认为不停止
     * @return 一个定时器
     */
    playDetails(speed, stop = false) {
      return setInterval(() => {
        let last = (this.currentIndex === 0) ? this.order[7] : this.order[this.currentIndex - 1];
        this.svgIcons[last].active = false;
        this.svgIcons[this.order[this.currentIndex]].active = true;
        // 判断是否需要停止
        if (this.currentIndex === this.stopIndex && stop) {
          clearInterval(this.timer1);
          console.log(this.svgIcons[this.order[this.currentIndex]].url);
          this.start = false;
        }
        this.currentIndex = (this.currentIndex < 7) ? this.currentIndex + 1 : 0;
      }, speed);
    },
    getStopNum() {
      this.$axios.get('http://localhost:3000/getstopnum').then(res => {
        this.stopIndex = res.data.num;
        this.count -= 1;
      }, () => {
        alert('服务器繁忙，请稍后再来');
      });
    }
  },
  watch: {
    stopIndex(newValue) {
      this.stop(newValue)
    }
  },
  created() {
    this.currentIndex = this.startNum;
    this.currentSpeed = this.speed;
    // 逆时针改变数组的的顺序
    if (!this.direction) {
      this.order = this.order.slice(0, 1).concat(this.order.slice(1).reverse())
    }
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
  transform: scale(1.3);
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
  flex-direction: column;
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
