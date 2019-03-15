<template>
  <div :class="$style.slotmachinewrap">
    <div :class="$style.slotmachine">
      <slot-machine
        v-for="(item, index) in slotMachineDetails"
        :details="item"
        :key="index"
        :mode="false"
        :play="move"
        @movedown="move = false"
      ></slot-machine>
    </div>
    <div
      :class="$style.play"
      @click="play()"
    >
      play
    </div>
  </div>
</template>

<script>
import slotMachine from '@/components/slotMachine.vue';
export default {
  components: {
    'slot-machine': slotMachine
  },
  data() {
    return {
      slotMachineDetails: [
        {
          currentSpeed: 40,
          stopIndex: 1,
          icons: [
            { url: "#icon-ningmeng" },
            { url: "#icon-yumi" },
            { url: "#icon-niuyouguo" },
            { url: "#icon-qiezi" },
            { url: "#icon-chelizi" },
            { url: "#icon-kaixinguo" },
            { url: "#icon-caihua" },
            { url: "#icon-dacong" }
          ]
        },
        {
          currentSpeed: 30,
          stopIndex: 5,
          icons: [
            { url: "#icon-ningmeng" },
            { url: "#icon-yumi" },
            { url: "#icon-niuyouguo" },
            { url: "#icon-qiezi" },
            { url: "#icon-chelizi" },
            { url: "#icon-kaixinguo" },
            { url: "#icon-caihua" },
            { url: "#icon-dacong" }
          ]
        },
        {
          currentSpeed: 10,
          stopIndex: 5,
          icons: [
            { url: "#icon-ningmeng" },
            { url: "#icon-yumi" },
            { url: "#icon-niuyouguo" },
            { url: "#icon-qiezi" },
            { url: "#icon-chelizi" },
            { url: "#icon-kaixinguo" },
            { url: "#icon-caihua" },
            { url: "#icon-dacong" }
          ]
        },
        {
          currentSpeed: 40,
          stopIndex: 5,
          icons: [
            { url: "#icon-ningmeng" },
            { url: "#icon-yumi" },
            { url: "#icon-niuyouguo" },
            { url: "#icon-qiezi" },
            { url: "#icon-chelizi" },
            { url: "#icon-kaixinguo" },
            { url: "#icon-caihua" },
            { url: "#icon-dacong" }
          ]
        },
      ],
      move: false,
    }
  },
  methods: {
    play() {
      this.move = true;
    }
  }
}
</script>

<style lang="postcss" module>
@import "../base/gobal.css";
.slotmachinewrap {
  @mixin flexbox;
  padding: 60px;
  flex-direction: column;
}
.slotmachine {
  @mixin flexbox;
  justify-content: space-around;
  width: 300px;
  border: 1px solid black;
}
.play {
  padding: 8px;
  margin: 20px;
  border-radius: 10px;
  border: 1px solid #a6a6a6;
  transition: all 1s;
}
.play:hover {
  padding-left: 12px;
  padding-right: 15px;
  border-color: #e8e8e8;
}
/* .slotmachine::before {
  content: "";
  display: block;
  position: absolute;
  top: 0%;
  width: 200px;
  height: 50px;

} */
</style>
