<template>
  <div :class="$style.contain">
    <div
      :class="$style.wrap"
      @mousemove="moveBlock"
      @mouseup="leaveBlock"
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
          :class="$style.refresh"
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
    init() {
      this.ctx = this.$refs.canvasFir.getContext('2d');
      this.twoCtx = this.$refs.canvasSec.getContext('2d');
      this.thrCtx = this.$refs.canvasThr.getContext('2d');
      this.fouCtx = this.$refs.canvasFou.getContext('2d');
      Object.assign(this.inView, this.$refs.canvasFir.getBoundingClientRect().toJSON());
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
        this.drawArc(this.thrCtx, this.trickX, this.blockY, 'fill');
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
      this.startTime = new Date();
      this.isMouseDown = true;
      this.pointLeft = x - this.$refs.block.getBoundingClientRect().left;
      this.moveStartX = x - this.pointLeft - this.inView.left;
      this.currentX = x - this.pointLeft - this.inView.left;
    },
    moveBlock(e) {
      if (this.isMouseDown) {
        let x = (e.clientX || e.touches[0].clientX);
        let y = (e.clientY || e.touches[0].clientY);
        this.currentX = x - this.pointLeft - this.inView.left;
        const { left, top, width, height } = this.$refs.wrap.getBoundingClientRect();
        if (x <= left || x >= Math.floor(left + width) || y <= top || y >= Math.floor(top + height)) {
          this.leaveBlock(e);
        }
      }

    },
    leaveBlock(e) {
      if (this.isMouseDown) {
        this.endTime = new Date();
        this.isMouseDown = false;
        this.barMove = (e.clientX || e.changedTouches[0].clientX) - this.moveStartX + 2 - this.pointLeft - this.inView.left;
        this.blockMove = this.clipX - this.blockX;
        console.log(e.type)
        if (e.type === 'touchend' || 'touchmove') {
          this.verify(e);
          this.open = false;
        }
        if (this.open) {
          this.verify(e);
        }
      }
    },
    verify(e) {
      if (this.barMove + 3 >= this.blockMove && this.barMove - 3 <= this.blockMove) {
        const time = (this.endTime - this.startTime) / 1000;
        if (time > 5) {
          this.verifyRetry(e, `用时${time}s,超过5s`);
          if (this.errCount >= 2) {
            console.log(this.errCount);
            this.verifyNext('三次防刷');
          }
        } else {
          this.verifyNext(`恭喜你成功了,用时${time}s`);
        }
      } else {
        if (this.errCount >= 2) {
          console.log(this.errCount);
          this.verifyNext('三次防刷');
        } else {
          this.verifyRetry(e, '验证失败了。。');
        }
      }
    },
    verifyNext(msg) {
      this.actionMsg = msg;
      this.toast = true;
      setTimeout(() => {
        this.refresh();
      }, 1000);
    },
    verifyRetry(e, msg) {
      console.log(e)
      this.actionMsg = msg;
      this.toast = true;
      setTimeout(() => {
        this.toast = false;
        this.errCount++;
        this.currentX = this.moveStartX;
      }, 1000);
      console.log(this.errCount);
    },
    refresh() {
      this.toast = false;
      this.errCount = 0;
      this.init();
      this.currentIndex = (this.currentIndex === this.imgSrcs.length - 1) ? 0 : this.currentIndex + 1;
      this.drawImage(this.imgSrcs[this.currentIndex]);
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
