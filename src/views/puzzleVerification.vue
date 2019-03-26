<template>
  <div :class="$style.wrap">
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
        :style="blockStyle"
      ></canvas>
      <canvas
        :class="[$style.canvas,$style.four]"
        ref="canvasFou"
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
        @click="$router.push('/')"
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
        @mousemove="moveBlock"
        @mouseup="leaveBlock"
        :style="blockStyle"
      >
        <svg
          :class="$style.left"
          aria-hidden="true"
          @click="refresh"
        >
          <use xlink:href="#icon-left"></use>
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 0,
      height: 0,
      ctx: '',
      blockCtx: '',
      thrCtx: '',
      isMouseDown: false,
      moveStartX: 0,
      currentX: 0,
      blockX: 0,
      clipX: 0,
      currentIndex: 0,
      errCount: 0,
      toast: false,
      actionMsg: '',
      startTime: '',
      endTime: '',
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
    setCanvas() {
      this.ctx = this.$refs.canvasFir.getContext('2d');
      this.blockCtx = this.$refs.canvasSec.getContext('2d');
      this.thrCtx = this.$refs.canvasThr.getContext('2d');
      this.fouCtx = this.$refs.canvasFou.getContext('2d');
      this.height = this.$refs.canvasFir.clientHeight;
      this.width = this.$refs.canvasFir.clientWidth;
      this.$refs.canvasFir.width = this.width;
      this.$refs.canvasFir.height = this.height;
      this.$refs.canvasSec.width = this.width;
      this.$refs.canvasSec.height = this.height;
      this.$refs.canvasThr.width = this.width;
      this.$refs.canvasThr.height = this.height;
      this.$refs.canvasFou.width = this.width;
      this.$refs.canvasFou.height = this.height;
    },
    drawImage(src) {
      let img = new Image();
      img.src = src;
      const squareWidth = this.width / 8 + 2 * this.width / 60 + 5;
      const squareHeight = this.width / 8 + 4;
      this.clipX = Math.floor(Math.random() * (this.width - squareWidth));
      this.blockX = Math.floor(Math.random() * ((this.width) - squareWidth));
      while (!(this.clipX - squareWidth > this.blockX || this.clipX + squareWidth < this.blockX)) {
        this.blockX = Math.floor(Math.random() * ((this.width) - squareWidth));
      }
      let trickX = Math.floor(Math.random() * ((this.width) - squareWidth));
      while (!((this.clipX - squareWidth > trickX || this.clipX + squareWidth < trickX)
        && (this.blockX - squareWidth > trickX || this.blockX + squareWidth < trickX))) {
        trickX = Math.floor(Math.random() * ((this.width) - squareWidth));
      }
      let y = Math.floor(Math.random() * (this.height - this.width / 5));
      this.moveStartX = this.blockX;
      this.currentX = this.blockX;
      img.onload = () => {
        this.drawArc(this.ctx, this.clipX, y, 'fill');
        this.drawArc(this.blockCtx, this.clipX, y, 'clip');
        this.drawArc(this.fouCtx, trickX, y, 'clip');
        this.blockCtx.drawImage(img, 0, 0, this.width, this.height);
        this.fouCtx.drawImage(img, 0, 0, this.width, this.height);
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
        const ImageData = this.blockCtx.getImageData(this.clipX - 4, y - 3, squareWidth, squareHeight);
        this.thrCtx.putImageData(ImageData, 0, y - 2);
      }
    },
    //划线剪切
    drawArc(ctx, x, y, operation) {
      const l = this.width / 8;
      const r = this.width / 60;
      const PI = Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI);
      ctx.lineTo(x + l, y + l);
      ctx.arc(x + l / 2, y + l - r + 2, r, 2.26 * PI, 0.72 * PI, true);
      ctx.lineTo(x, y + l);
      ctx.lineTo(x, y);
      ctx.lineWidth = 1;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'
      ctx.strokeStyle = '#eaebec'
      ctx.stroke();
      ctx[operation]();
    },
    clickBlock(e) {
      this.startTime = new Date();
      this.isMouseDown = true;
    },
    moveBlock(e) {
      if (this.isMouseDown) {
        this.currentX = (e.clientX || e.touches[0].clientX) - this.width / 5;
      }
    },
    leaveBlock(e) {
      this.isMouseDown = false;
      const barmove = (e.clientX || e.changedTouches[0].clientX) - this.moveStartX + 2 - this.width / 5;
      const blockmove = this.clipX - this.blockX;
      if (barmove + 3 >= blockmove && barmove - 3 <= blockmove) {
        this.endTime = new Date();
        const time = (this.endTime - this.startTime) / 1000;
        if (time > 5) {
          this.actionMsg = `用时${time}s,超过5s`;
          this.toast = true;
          setTimeout(() => {
            this.toast = false;
            this.errCount++;
            this.currentX = this.moveStartX;
          }, 1000);
        } else {
          this.actionMsg = `恭喜你成功了,用时${time}s`;
          this.toast = true;
          setTimeout(() => {
            this.refresh();
          }, 1000);
        }
      } else {
        if (this.errCount >= 2) {
          this.actionMsg = '三次防刷';
          this.toast = true;
          setTimeout(() => {
            this.refresh();
          }, 1000);
        } else {
          this.actionMsg = '验证失败了。。';
          this.toast = true;
          setTimeout(() => {
            this.toast = false;
            this.errCount++;
            this.currentX = this.moveStartX;
          }, 1000);
        }
      }
    },
    refresh() {
      this.toast = false;
      this.errCount = 0;
      this.setCanvas();
      this.currentIndex = (this.currentIndex === this.imgSrcs.length - 1) ? 0 : this.currentIndex + 1;
      this.drawImage(this.imgSrcs[this.currentIndex]);
    }
  },
  computed: {
    blockStyle() {
      let move = this.moveStartX + (this.currentX - this.moveStartX);
      if (move < 0) {
        move = 0;
      } else if (move > this.width) {
        move = this.width;
      }
      return {
        marginLeft: `${move}px`
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.setCanvas();
      this.drawImage(this.imgSrcs[this.currentIndex]);
    });
  }
}
</script>

<style lang="postcss" module>
@import "../base/gobal.css";
.wrap {
  @mixin flexbox;
  flex-direction: column;
  margin: 30vw auto 0 auto;
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
  z-index: 10;
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
  z-index: 1;
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
