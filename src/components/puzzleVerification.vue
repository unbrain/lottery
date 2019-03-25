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
    </div>
    <div :class="$style.barwrap">
      <div
        :class="$style.block"
        ref="block"
        @touchstart="clickBlock"
        @touchmove="moveBlock"
        @touchend="leaveBlock"
        :style="blockStyle"
      >
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
      x: 0
    }
  },
  methods: {
    setCanvas() {
      this.ctx = this.$refs.canvasFir.getContext('2d');
      this.blockCtx = this.$refs.canvasSec.getContext('2d');
      this.thrCtx = this.$refs.canvasThr.getContext('2d');
      this.height = this.$refs.canvasFir.clientHeight;
      this.width = this.$refs.canvasFir.clientWidth;
      this.$refs.canvasFir.width = this.width;
      this.$refs.canvasFir.height = this.height;
      this.$refs.canvasSec.width = this.width;
      this.$refs.canvasSec.height = this.height;
      this.$refs.canvasThr.width = this.width;
      this.$refs.canvasThr.height = this.height;
    },
    drawImage() {
      this.x = Math.floor(Math.random() * ((this.width / 2) - 58) + this.width / 2);
      let y = Math.floor(Math.random() * (this.height - 42));
      this.blockX = Math.floor(Math.random() * ((this.width / 2) - 58));
      let img = new Image();
      img.src = require('@/assets/16-2.png');
      img.onload = () => {
        this.drawArc(this.ctx, this.x, y, 'fill');
        this.drawArc(this.blockCtx, this.x, y, 'clip');
        this.blockCtx.drawImage(img, 0, 0, this.width, this.height);
        this.ctx.drawImage(img, 0, 0, this.width, this.height);
        const ImageData = this.blockCtx.getImageData(this.x - 2, y - 2, 58, 44);
        this.thrCtx.putImageData(ImageData, this.blockX, y - 2);
        // this.drawImageProp(ctx, img, 0, 0, this.width, this.height,0.5,0.5);
      }
    },
    //划线剪切 长 56 高 42 外边框 1
    drawArc(ctx, x, y, operation) {
      const l = 42;
      const r = 8;
      const PI = Math.PI;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + l, y);
      ctx.arc(x + l + r - 2, y + l / 2, r, 1.21 * PI, 2.78 * PI)
      ctx.lineTo(x + l, y + l)
      ctx.arc(x + l / 2, y + l - r + 2, r, 2.26 * PI, 0.72 * PI, true)
      ctx.lineTo(x, y + l)
      ctx.lineTo(x, y)
      ctx.lineWidth = 1
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)'
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.stroke()
      ctx[operation]()
    },
    clickBlock(e) {
      console.log(this.$refs.block.offsetLeft);
      console.log(e.touches[0].clientX);
      this.moveStartX = e.touches[0].clientX;
      this.currentX = e.touches[0].clientX;
      this.isMouseDown = true;
    },
    moveBlock(e) {
      if (this.isMouseDown) {
        this.currentX = e.touches[0].clientX;
      }
    },
    leaveBlock(e) {
      this.isMouseDown = false;
      const barmove = e.changedTouches[0].clientX - this.moveStartX + 2;
      const blockmove = this.x - this.blockX;
      console.log(barmove, blockmove)
      if (barmove + 3 >= blockmove && barmove - 3 <= blockmove) {
        console.log('success!')
      }
    }
  },
  computed: {
    blockStyle() {
      return {
        marginLeft: `${this.currentX - this.moveStartX}px`
      }
    }
  },
  created() {
    this.$nextTick(() => {
      this.setCanvas();
      this.drawImage();
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
  box-shadow: 0 4px 20px 0 rgba(56, 6auto7, 74, 0.5);
  overflow: hidden;
}
.canvas {
  width: 80vw;
  height: 45vw;
  overflow: hidden;
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
}
.barwrap {
  border: 1px solid #e4e7eb;
  width: 80vw;
}
.block {
  width: 8vw;
  height: 8vw;
  margin-left: 0px;
  background-color: #000;
}
</style>
