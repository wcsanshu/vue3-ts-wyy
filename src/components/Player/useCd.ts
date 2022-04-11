import { useUserStoreWithOut } from "@/store/store"
import { storeToRefs } from "pinia"
import { computed, ref, watch } from "vue"
export default function useCd() {
  const cdImgRef = ref(null)
  const cdRef = ref(null)
  const { playing } = storeToRefs(useUserStoreWithOut())

  // 根据是否播放绑定唱片渲染样式
  const cdCls = computed(() => {
    return playing.value ? "playing" : ""
  })

  // 监听并且同步唱片旋转角度
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImgRef.value)
    }
  })

  function syncTransform(wrap, inner) {
    const wrapperTransform = getComputedStyle(wrap).transform
    const innerTransform = getComputedStyle(inner).transform

    wrap.style.transform =
      wrapperTransform === "none"
        ? innerTransform
        : innerTransform.concat(" ", wrapperTransform)
  }

  return { cdCls, cdImgRef, cdRef }
}
