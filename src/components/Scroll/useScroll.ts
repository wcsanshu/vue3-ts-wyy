import BScroll from "@better-scroll/core"
import { BScrollConstructor } from "@better-scroll/core/dist/types/BScroll"
import ObserveDOM from "@better-scroll/observe-dom"
import { onMounted, onUnmounted, ref } from "vue"

// npm install @better-scroll/observe-dom --save
BScroll.use(ObserveDOM)
export default function useScroll(wrapperRef: any, options: any, emits: any) {
  const scroll = ref<BScrollConstructor | null>(null)

  // 初始化滚动插件 (传入dom)
  onMounted(() => {
    const scrollVal = (scroll.value = new BScroll(wrapperRef.value, {
      observeDOM: true,
      ...options
    }))

    // 如果probeType大于0 说明要监听滚动事件
    if (options.probeType > 0) {
      // pos 滚动位置
      // 如何让外部组件拿到pos滚动值?
      // 这里可以使用事件派发
      scrollVal.on("scroll", (pos) => {
        // 通过emits 派发位置信息
        emits("scroll", pos)
      })
    }
  })

  // 销毁时卸载逻辑
  onUnmounted(() => {
    if (scroll.value) {
      scroll.value.destroy()
    }
  })

  return scroll
}
