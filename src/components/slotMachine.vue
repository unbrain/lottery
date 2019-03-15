<template>
  <div :class="$style.wrap">
    <ul
      name="list"
      tag="ul"
      :class="$style.svgcontain"
      :style="changeY"
      ref="svgcontain"
    >
      <li
        v-for="(item) in cloneSvgIcons"
        :key="item.url"
        :class="$style.svgwrap"
        ref="svg"
        mode="out-in"
      >
        <svg
          :class="{[$style.icon]: true}"
          aria-hidden="true"
        >
          <use :xlink:href="item.url"></use>
        </svg>
      </li>
      <li ref="icon">
        <svg
          :class="{[$style.icon]: true}"
          aria-hidden="true"
        >
          <use :xlink:href="cloneSvgIcons[0].url"></use>
        </svg>
      </li>
    </ul>
  </div>
</template>

<script>
/**
 *  老虎机单个组件
 *  必须传入
 *  currentSpeed　开始速度
 *  stopIndex 停止位置(停止位从 0 开始)
 *  可选参数
 *  mode 模式　０　乱序模式（非同一时间线）１　有序模式（非同一时间线）
 */
export default {
  props: {
    mode: {
      type: Boolean,
      default: false
    },
    play: {
      type: Boolean,
      default: false
    },
    details: {
      type: Object
    }
  },
  data() {
    return {
      turnsNum: 0, // 圈数
      timer: '',
      moveY: 0,
      iconHeight: 0,
      wrapHeight: 0,
      cloneSvgIcons: this.details.icons
    }
  },
  computed: {
    changeY() {
      return {
        transform: `translateY(${-this.moveY}px)`
      }
    }
  },
  watch: {
    turnsNum(newValue) {
      let speed1 = this.mode ? 15 : 5 + 20 * Math.random(1);
      let speed2 = this.mode ? 3 : 1 + 5 * Math.random(1);
      if (newValue === 1) {
        clearInterval(this.timer);
        this.timer = this.playDetails(speed1);
      } else if (newValue === 2) {
        clearInterval(this.timer);
        this.timer = this.playDetails(speed2, true);
      }
    },
    play(newValue) {
      if (newValue === true) {
        this.cloneSvgIcons = this.details.icons;
        // 根据提供的停止位置对数据进行处理
        this.cloneSvgIcons = this.cloneSvgIcons.slice(this.details.stopIndex).concat(this.cloneSvgIcons.slice(0, this.details.stopIndex));
        this.timer = this.playDetails(this.details.currentSpeed);
      }
    },
  },
  methods: {
    // play() {
    //   let num = 0;
    //   this.timer = setInterval(() => { //垂直逻辑
    //     num = (num < this.cloneSvgIcons.length) ? num + 1 : 0;
    //     const a = this.cloneSvgIcons.shift();
    //     setTimeout(() => {
    //       this.cloneSvgIcons.push(a);
    //     }, 50);
    //     if (num === 0) {
    //       this.turnsNum++;
    //     }
    //   }, 50);
    // },
    // 尝试　transition-group  效果不佳
    // playDetails(speed, stop = false) {
    //   return setInterval(() => {
    //     if (this.cloneSvgIcons[2].url === "#icon-niuyouguo") {
    //       this.turnsNum++;// 计算圈数
    //     }
    //     const a = this.cloneSvgIcons.shift();
    //     setTimeout(() => {
    //       this.cloneSvgIcons.push(a);
    //     }, 50);
    //     // 判断是否需要停止
    //     if (this.cloneSvgIcons[2].url === this.stopUrl && stop) {
    //       console.log(1);
    //       clearInterval(this.timer)
    //       // this.count -= 1;
    //       // let award = (this.cloneSvgIcons[this.order[this.currentIndex]].url.match(/-(.+)/)[1]);
    //     }
    //   }, speed);
    // }
    playDetails(speed, stop = false) {
      return setInterval(() => {
        //  计算圈数
        // console.log(this.moveY)
        if (this.moveY === 0) {
          this.turnsNum++;
        }
        // 判断是否移动了整身
        this.moveY = (this.moveY >= (this.wrapHeight - this.iconHeight)) ? 0 : this.moveY + speed;
        // 判断停止位置
        if (this.moveY === 0 && stop) {
          this.stop();
        }
      }, 30);
    },
    stop() {
      this.moveY = 0;
      clearInterval(this.timer);
      this.turnsNum = 0;
      this.$emit('movedown');
    }
  },
  created() {
    // this.timer = this.playDetails(30);

    this.$nextTick(() => {
      this.wrapHeight = this.$refs.svgcontain.clientHeight;
      this.iconHeight = this.$refs.icon.clientHeight;
    });

  },
  destroyed() {
    clearInterval(this.timer);
  }
}
</script>

<style lang="postcss" module>
@import "../base/gobal.css";

.wrap {
  width: 50px;
  height: 50px;
  overflow: hidden;
}

.svgcontain {
  display: inline-block;
}

.svgwrap {
  transition: 0.5s ease;
}

.icon {
  width: 50px;
  height: 50px;
}

.list-enter {
  transform: translateY(100%);
}
.list-leave-to {
  transform: translateY(-100%);
}

.list-leave-active {
  position: absolute;
}
</style>
