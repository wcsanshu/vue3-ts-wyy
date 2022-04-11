<!-- 播放器进度条 -->
<template>
  <div ref="ProwidthRef" class="progress-bar">
    <div class="bar-inner">
      <!-- 已播放进度条样式 -->
      <div ref="progressRef" :style="progressStyle" class="progress"></div>
      <!-- 进度条按钮 -->
      <div
        :style="btnStyle"
        class="progress-btn-wrapper"
        @touchstart.prevent="onTouchStart"
        @touchmove.prevent="onTouchMove"
        @touchend.prevent="onTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ref, watch, computed, defineComponent } from "vue"
export default defineComponent({
  name: "ProgressBar",
  props: {
    progress: {
      type: Number
    }
  },
  emits: ["progressChanging", "progressChanged"],
  setup(props, { emit }) {
    const ProwidthRef = ref<HTMLDivElement | any>()
    const progressRef = ref<HTMLDivElement | any>()
    const touch = ref<any>({})
    // const props = defineProps({
    //   // 进度
    //   progress: {
    //     type: Number,
    //     default: 0
    //   }
    // })
    const offset = ref(0) // 偏移量
    watch(
      () => props.progress,
      (newProgress) => {
        setOffset(newProgress)
      }
    )
    // 已播放进度条样式宽度绑定
    const progressStyle = computed(() => `width:${offset.value}px`)
    // 进度条按钮
    const btnStyle = computed(
      () => `transform:translate3d(${offset.value}px,0,0)`
    )

    // 获取两个信息 开始位置 和 开始进度条宽度(左侧 已播放部分进度条)
    const onTouchStart = (e) => {
      touch.value.x1 = e.touches[0].pageX

      // 已播放进度条 初始宽度获取
      touch.value.beginWidth = progressRef.value?.clientWidth
    }

    // 接触点改变，滑动时触发
    const onTouchMove = (e) => {
      const delta = e.touches[0].pageX - touch.value.x1
      const tempWidth = touch.value.beginWidth + delta

      // const barWidth = ProwidthRef.value?.clientHeight - 16
      const barWidth = ProwidthRef.value.clientWidth - 16

      const progress = Math.min(1, Math.max(tempWidth / barWidth, 0))

      offset.value = barWidth * progress

      emit("progressChanging", progress)
    }
    // 滑动结束时触发
    const onTouchEnd = () => {
      const barWidth = ProwidthRef.value?.clientWidth - 16
      const progress = progressRef.value?.clientWidth / barWidth
      emit("progressChanged", progress)
    }

    // 解决bug
    function setOffset(process) {
      //  拿到进度条总宽度
      // div元素总宽度 - 按钮宽度

      const barWidth = ProwidthRef.value.clientWidth - 16
      // 计算偏移量
      offset.value = barWidth * process
    }
    return {
      progressStyle,
      btnStyle,
      ProwidthRef,
      progressRef,
      onTouchEnd,
      setOffset,
      onTouchMove,
      onTouchStart
    }
  }
})
</script>
<style lang="scss" scoped>
.progress-bar {
  height: 30px;

  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
