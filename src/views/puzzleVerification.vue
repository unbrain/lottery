<template>
  <div
    :class="$style.contain"
    @mousemove="moveBlock"
    @mouseup="leaveBlock"
  >
    <div
      :class="$style.wrap"
      ref="wrap"
    >
      <div :class="$style.imgwrap">
        <canvas
          :class="[$style.canvas,$style.one]"
          ref="canvasFir"
        ></canvas>
        <canvas
          :class="[$style.canvas,$style.two]"
          ref="canvasSec"
        ></canvas>
        <canvas
          :class="[$style.canvas,$style.three]"
          ref="canvasThr"
        ></canvas>
        <canvas
          :class="[$style.canvas,$style.four]"
          ref="canvasFou"
          :style="blockStyle"
        ></canvas>
        <svg
          :class="[$style.refresh, {[$style.refreshaction]: isRefresh}]"
          aria-hidden="true"
          @click="refresh"
        >
          <use xlink:href="#icon-refresh"></use>
        </svg>
        <svg
          :class="$style.close"
          aria-hidden="true"
          @click="$router.push('/slotwrap')"
        >
          <use xlink:href="#icon-close"></use>
        </svg>
        <transition
          name="list"
          tag="div"
        >
          <div
            :class="$style.toast"
            v-if="toast"
            v-text="actionMsg"
          ></div>
        </transition>
      </div>

      <div :class="$style.barwrap">
        <div
          :class="$style.block"
          ref="block"
          @touchstart="clickBlock"
          @touchstart.prevent
          @touchmove="moveBlock"
          @touchend="leaveBlock"
          @mousedown="clickBlock"
          :style="blockStyle"
        >
          <svg
            :class="$style.left"
            aria-hidden="true"
          >
            <use xlink:href="#icon-left"></use>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    config: {
      default: () => {
        return {
          deviation: 3,// 两块拼图重合判断为成功时 x 轴最大偏移量
          puzzleFake: true,// 混淆拼图是否存在
          touchDeadline: 5,// 滑动有效时间
          onSuccess(time, fn) {
            // 字符串可修改，注释将不显示提示信息
            fn(`成功了，用时${time}s`);
          },
          onFailed(fn) {
            fn('验证失败了。。');
          },
          onRobot(fn) {
            fn('你还是人类吗');
          },
          onMuchTry(fn) {
            fn('三次防刷');
          },
          onTimeout(time, fn) {
            fn(`用时${time}s,超过${this.touchDeadline}s`);
          }
        }
      },
      type: Object
    }
  },
  data() {
    return {
      inView: {
        width: 0,
        height: 0,
        left: 0,
        right: 0,
      },
      puzzle: {
        l: 0,
        r: 0,
        height: 0,
        width: 0
      },
      pointLeft: 0,
      ctx: '',
      twoCtx: '',
      thrCtx: '',
      fouCtx: '',
      isMouseDown: false,
      isMouseMove: false,
      moveStartX: 0,
      currentX: 0,
      blockX: 0,
      blockY: 0,
      clipX: 0,
      trickX: 0,
      currentIndex: 0,
      errCount: 0,
      toast: false,
      actionMsg: '',
      startTime: '',
      endTime: '',
      barMove: 0,
      blockMove: 0,
      open: true,
      isRefresh: false,
      refreshTime: 1000,
      isYMove: false,
      startY: 0,
      imgSrcs: [
        require('@/assets/16-0.jpg'),
        require('@/assets/16-1.png'),
        require('@/assets/16-2.png'),
        require('@/assets/16-3.png'),
        require('@/assets/16-4.png'),
        require('@/assets/16-5.png'),
        require('@/assets/16-6.png'),
        require('@/assets/16-7.png'),
        require('@/assets/16-8.png'),
        require('@/assets/16-9.png')
      ]
    }
  },
  methods: {
    getBoundingClientRect(element) {
      const { top, right, bottom, left, width, height, x, y } = element.getBoundingClientRect();
      return { top, right, bottom, left, width, height, x, y }
    },
    init() {
      this.ctx = this.$refs.canvasFir.getContext('2d');
      this.twoCtx = this.$refs.canvasSec.getContext('2d');
      this.thrCtx = this.$refs.canvasThr.getContext('2d');
      this.fouCtx = this.$refs.canvasFou.getContext('2d');
      Object.assign(this.inView, this.getBoundingClientRect(this.$refs.canvasFir));
      this.puzzle.l = this.inView.width / 8;
      this.puzzle.r = this.inView.width / 40;
      this.$refs.block.style.width = this.puzzle.l + 2 * this.puzzle.r + 'px';
      // 对 canvas 的宽高进行赋值以免图片模糊
      for (let key in this.$refs) {
        this.$refs[key].width = this.inView.width;
        this.$refs[key].height = this.inView.height;
      }
    },
    imageInit() {
      this.puzzle.width = this.puzzle.l + 2 * this.puzzle.r + 1;
      this.puzzle.height = this.puzzle.l + 3;
      this.clipX = Math.floor(Math.random() * (this.inView.width - this.puzzle.width));
      this.blockX = Math.floor(Math.random() * ((this.inView.width) - this.puzzle.width));
      while (!(this.clipX - this.puzzle.width > this.blockX || this.clipX + this.puzzle.width < this.blockX)) {
        this.blockX = Math.floor(Math.random() * ((this.inView.width) - this.puzzle.width));
      }
      this.trickX = Math.floor(Math.random() * ((this.inView.width) - this.puzzle.width));
      while (!((this.clipX - this.puzzle.width > this.trickX || this.clipX + this.puzzle.width < this.trickX)
        && (this.blockX - this.puzzle.width > this.trickX || this.blockX + this.puzzle.width < this.trickX))) {
        this.trickX = Math.floor(Math.random() * ((this.inView.width) - this.puzzle.width));
      }
      this.blockY = Math.floor(Math.random() * (this.inView.height - this.inView.width / 5));
      this.moveStartX = this.blockX;
      this.currentX = this.blockX;
    },
    drawImage(src) {
      let img = new Image();
      img.src = src;
      this.imageInit();
      img.onload = () => {
        // 画布 底层
        this.ctx.drawImage(img, 0, 0, this.inView.width, this.inView.height);
        // 切拼图层
        this.drawArc(this.twoCtx, this.clipX, this.blockY, 'clip');
        this.twoCtx.drawImage(img, 0, 0, this.inView.width, this.inView.height);
        // 画两个假拼图块
        this.drawArc(this.thrCtx, this.clipX, this.blockY, 'fill');
        if (this.config.puzzleFake) {
          this.drawArc(this.thrCtx, this.trickX, this.blockY, 'fill');
        }
        // 画移动块层
        const ImageData = this.twoCtx.getImageData(this.clipX - 1, this.blockY - 2, this.puzzle.width, this.puzzle.height);
        this.fouCtx.putImageData(ImageData, 0, this.blockY - 2);
      }
    },
    //划线剪切
    drawArc(ctx, x, y, operation) {
      const l = this.puzzle.l;
      const r = this.puzzle.r;
      const PI = Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
      ctx.lineTo(x + l, y + l);
      ctx.arc(x + l / 2, y + l - r + 2, r, 2.26 * PI, 0.72 * PI, true);
      ctx.lineTo(x, y + l);
      ctx.lineTo(x, y);
      ctx.closePath();
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.strokeStyle = '#eaebec'
      ctx.stroke();
      if (operation) {
        ctx[operation]();
      }
    },
    clickBlock(e) {
      let x = (e.clientX || e.touches[0].clientX);
      this.startY = (e.clientY || e.touches[0].clientY);
      this.startTime = new Date();
      this.isMouseDown = true;
      this.isYMove = false;
      this.pointLeft = x - this.$refs.block.getBoundingClientRect().left;
      // this.moveStartX = x - this.pointLeft - this.inView.left;
      this.currentX = x - this.pointLeft - this.inView.left;
    },
    moveBlock(e) {
      if (this.isMouseDown) {
        this.isMouseMove = true;
        let x = (e.clientX || e.touches[0].clientX);
        let y = (e.clientY || e.touches[0].clientY);
        this.currentX = x - this.pointLeft - this.inView.left;
        const { left, top, width, height } = this.getBoundingClientRect(this.$refs.wrap);
        if (!this.isYMove) {
          if (y !== this.startY) {
            this.isYMove = true;
          }
        }
        if (x <= left || x >= Math.floor(left + width) || y <= top || y >= Math.floor(top + height)) {
          this.leaveBlock(e);
        }
      }
    },
    leaveBlock(e) {
      if (this.isMouseDown && this.isMouseMove) {
        this.endTime = new Date();
        this.isMouseDown = false;
        this.barMove = (e.clientX || e.changedTouches[0].clientX) - this.moveStartX - this.pointLeft - this.inView.left;
        this.blockMove = this.clipX - this.blockX;
        if (e.type === 'touchend' || e.type === 'touchmove') {
          this.verify(e);
          this.open = false;
        }
        if (this.open) {
          this.verify(e);
        }
      }
    },
    verify(e) {
      if (this.isYMove) {
        if (this.barMove + this.config.deviation >= this.blockMove && this.barMove - this.config.deviation <= this.blockMove) {
          const time = ((this.endTime - this.startTime) / 1000).toFixed(2);
          if (time > this.config.touchDeadline) {
            this.config.onTimeout(time, this.showMsg);
            this.verifyRetry(e);
            if (this.errCount >= 2) {
              this.config.onMuchTry(this.showMsg);
              this.verifyNext();
            }
          } else {
            this.config.onSuccess(time, this.showMsg);
            this.verifyNext();
          }
        } else {
          if (this.errCount >= 2) {
            this.config.onMuchTry(this.showMsg);
            this.verifyNext();
          } else {
            this.config.onFailed(this.showMsg);
            this.verifyRetry(e);
          }
        }
      } else {
        this.config.onRobot(this.showMsg);
        this.verifyRetry(e);
        if (this.errCount >= 2) {
          this.config.onMuchTry(this.showMsg);
          this.verifyNext();
        }
      }
    },
    verifyNext() {
      setTimeout(() => {
        this.refresh();
      }, 1000);
    },
    verifyRetry(e) {
      setTimeout(() => {
        this.toast = false;
        this.errCount++;
        this.currentX = this.moveStartX;
      }, 1000);
    },
    showMsg(msg) {
      this.actionMsg = msg;
      this.toast = true;
    },
    refresh() {
      if (!this.isRefresh) {
        this.isRefresh = true;
        setTimeout(() => {
          this.isRefresh = false;
          this.toast = false;
          this.errCount = 0;
          this.init();
          this.currentIndex = (this.currentIndex === this.imgSrcs.length - 1) ? 0 : this.currentIndex + 1;
          this.drawImage(this.imgSrcs[this.currentIndex]);
        }, this.refreshTime);
      }
    }
  },
  computed: {
    blockStyle() {
      let maxWidth = this.inView.width;
      if (this.$refs.block) {
        maxWidth = maxWidth - this.$refs.block.getBoundingClientRect().width;
      }
      let move = this.moveStartX + (this.currentX - this.moveStartX);
      if (move < 0) {
        move = 0;
      } else if (move > maxWidth) {
        move = maxWidth;
      }
      return {
        marginLeft: `${move}px`
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
      this.drawImage(this.imgSrcs[this.currentIndex]);
    });
  }
}
</script>

<style lang="postcss" module>
@import "../base/gobal.css";
.contain {
  margin-top: 30px;
  @mixin flexbox;
}
.wrap {
  @mixin flexbox;
  padding: 10px;
  flex-direction: column;
  background-color: #fff;
  box-shadow: 0 4px 20px 0 rgba(56, 67, 74, 0.5);
  border-radius: 4px;
}
.canvas {
  width: 80vw;
  height: 45vw;
}
.imgwrap {
  position: relative;
  overflow: hidden;
}
.one {
}
.two {
  position: absolute;
  left: 0;
  top: 0;
}
.three {
  position: absolute;
  left: 0;
  top: 0;
}
.four {
  position: absolute;
  left: 0;
  top: 0;
}
.toast {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  font-size: 16px;
  line-height: 30px;
  background-color: rgba(255, 255, 255, 0.3);
  transition: 1s ease;
}
.barwrap {
  border: 1px solid #e1e1e1;
  width: 80vw;
  background-color: #e4e7eb;
  border-radius: 2px;
}
.block {
  @mixin flexbox;
  width: 8vw;
  height: 8vw;
  background-color: #fff;
  border-radius: 3px;
}
.refresh {
  position: absolute;
  right: 10px;
  bottom: 10px;
  height: 24px;
  width: 24px;
}
.refreshaction {
  transition: 1s;
  transform: rotate(-720deg);
}
.close {
  position: absolute;
  left: 10px;
  bottom: 10px;
  height: 24px;
  width: 24px;
}
.left {
  height: 24px;
  width: 24px;
  transform: rotate(180deg);
}
</style>
