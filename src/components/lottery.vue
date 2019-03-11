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
      default: 50
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
      stopIndex: 0,
      currentSpeed: 0,
      order: [0, 1, 2, 5, 8, 7, 6, 3],
      count: 1, // 抽奖次数
      turnsNum: 0, // 圈数
    }
  },
  watch: {
    turnsNum(newValue) {
      if (newValue === 5) {
        clearInterval(this.timer1);
        this.timer1 = this.playDetails(this.currentSpeed * 2);
      } else if (newValue === 6) {
        clearInterval(this.timer1);
        this.timer1 = this.playDetails(this.currentSpeed * 6, true);
      }
    }
  },
  methods: {
    play() {
      if (this.count) {
        this.getStopNum();
        this.start = true;
        this.timer1 = this.playDetails(this.currentSpeed);
      } else {
        this.$toast('没有机会啦！！！', { svg: '#icon-waring' });
      }
    },
    /**
     * speed 速度
     * stop 是否停止，默认为不停止
     * @return 一个定时器
     */
    playDetails(speed, stop = false) {
      return setInterval(() => {
        if (this.currentIndex === 0) {
          this.turnsNum++;// 计算圈数
        }
        let last = (this.currentIndex === 0) ? this.order[7] : this.order[this.currentIndex - 1];
        this.svgIcons[last].active = false;
        this.svgIcons[this.order[this.currentIndex]].active = true;
        // 判断是否需要停止
        if (this.currentIndex === this.stopIndex && stop) {
          this.stop()
          this.count -= 1;
          let award = (this.svgIcons[this.order[this.currentIndex]].url.match(/-(.+)/)[1]);
          this.$toast('恭喜你获得了' + award, { svg: '#icon-gongxi', closeDelay: 4 });
        }
        this.currentIndex = (this.currentIndex < 7) ? this.currentIndex + 1 : 0;
      }, speed);
    },
    getStopNum() {
      return this.$axios.get('http://localhost:3000/getstopnum').then(res => {
        this.stopIndex = res.data.num;
      }, () => {
        this.stop();
        this.$toast('服务器繁忙，请稍后再来', { svg: '#icon-waring' });
      });
    },
    /**
     *  数据初始化
    */
    stop() {
      clearInterval(this.timer1);
      this.turnsNum = 0;
      this.currentSpeed = this.speed;
      this.start = false;
    }
  },
  created() {
    this.currentIndex = this.startNum;
    this.currentSpeed = this.speed;
    // 逆时针改变数组的的顺序
    if (!this.direction) {
      this.order = this.order.slice(0, 1).concat(this.order.slice(1).reverse());
    }
    // 获取真实可抽奖次数
    this.$axios.get('http://localhost:3000/getchangenum').then(res => {
      this.count = res.data.num;
    })
  },
  beforeDestroy() {
    clearInterval(this.timer1);
  }
};
</script>

<style lang="postcss" module>
@import "../base/gobal.css";
ul,
li {
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
  @mixin flexbox;
  position: relative;
  flex-wrap: wrap;
  width: 210px;
}
.wrap {
  @mixin flexbox;
  flex-direction: column;
}
.start {
  position: absolute;
  background-color: #fff;
  padding: 10px;
}
.start > div {
  @mixin flexbox;
  width: 50px;
  height: 50px;
  border-radius: 100%;
  border: 1px solid #af8f6f;
  font-size: 16px;
}
.icon {
  width: 50px;
  height: 50px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
