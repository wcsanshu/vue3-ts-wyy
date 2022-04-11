<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script lang="ts">
import useScroll from "./useScroll"
import { ref } from "vue"

export default {
  name: "scroll",
  props: {
    click: {
      type: Boolean,
      default: true
    },
    // 为3则监听滚动事件
    probeType: {
      type: Number,
      default: 0
    }
  },
  emits: ["scroll"],
  setup(props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)

    return {
      rootRef,
      scroll
    }
  }
}
</script>
