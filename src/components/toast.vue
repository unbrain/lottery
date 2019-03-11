<template>
  <div class="toast">
    <div
      class="message"
      ref="toast"
    >
      <div :class="{iconaction:autoplay}">
        <svg
          class="icon"
          aria-hidden="true"
        >
          <use :xlink:href="svg"></use>
        </svg>
      </div>
      <slot v-if="!enableHtml"></slot>
      <div
        v-else
        v-html="$slots.default"
      ></div>
    </div>
    <div
      class="line"
      v-if="!autoClose"
      ref="line"
    ></div>
    <span
      v-if="!autoClose"
      class="close"
      @click="close"
    >关闭</span>
  </div>
</template>

<script>
/**
 * 这是一个简易 toast
 * 确保使用前导入了 pulgin.js
 * 使用在 component 中直接 this.$toast('msg',{props}) 即可使用
 * autoClose 是否自动关闭 默认为真
 * closeDelay 自动关闭时间 默认 2 秒
 * enableHtml 在 msg 中是否允许 v-html 默认为假
 * autoplay 标签是否允许转动 默认为假
 * svg 标签图样 默认是对勾
 */
export default {
  name: 'toast',
  props: {
    autoClose: { type: Boolean, default: true },
    closeDelay: { type: [Number, String], default: 2 },
    enableHtml: { type: Boolean, default: false },
    autoplay: { type: Boolean, default: false },
    svg: { type: String, default: '#icon-corrent' }
  },
  mounted() {
    this.updateStyles();
    if (this.autoClose) { setTimeout(() => { this.close(); }, this.closeDelay * 1000); }
  },
  methods: {
    updateStyles() {
      this.$nextTick(() => {
        if (!this.autoClose) {
          this.$refs.line.style.height =
            `${this.$refs.toast.getBoundingClientRect().height}px`;
        }
      });
    },
    close() {
      this.$el.remove();
      this.$destroy();
    },
  },
};
</script>

<style scoped lang="scss">
$font-size: 14px;
$toast-bg: rgba(0, 0, 0, 0.65);
$border-radius: 3px;
$min-height: 40px;
.toast {
  display: flex;
  position: fixed;
  align-items: center;
  top: 50%;
  left: 50%;
  margin: 0.75em 0;
  padding: 1em;
  background-color: $toast-bg;
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.5);
  border-radius: $border-radius;
  min-height: $min-height;
  line-height: 1.8;
  color: white;
  font-size: $font-size;
  word-break: break-all;
  transform: translate(-50%, -50%);
}

.message {
  display: flex;
  text-align: center;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 0.5em 0.75em;
}

.line {
  border-left: 1px solid #eeeeee;
}

.close {
  padding: 0.5em 0.75em;
  cursor: pointer;
  flex-shrink: 0;
}
.icon {
  width: 3rem;
  height: 3rem;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
.iconaction {
  width: 4rem;
  height: 4rem;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: myRotate 0.5s linear infinite;
}
@keyframes myRotate {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
