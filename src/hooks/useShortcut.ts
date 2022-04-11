import { SingerListType } from "@/types"
import { computed, ref } from "vue"

export default function useShortCut(props, groudRef) {
  const scrollRef = ref<any>(null)
  const ANHOR_HEIGHT = 18
  const touch: any = {}
  const shortcutList = computed(() => {
    return props.singerList.map((item) => {
      return item.title
    })
  })

  function onShortcutTouchStart(e) {
    console.log(e)

    // 拿到组件对应的索引
    const anchorIndex = parseInt(e.target.dataset.index)
    touch.y1 = e.touches[0].pageY
    touch.anchorIndex = anchorIndex
    scrollTo(anchorIndex)
  }

  function onShortcutTouchMove(e) {
    touch.y2 = e.touches[0].pageY
    const dalta = ((touch.y2 - touch.y1) / ANHOR_HEIGHT) | 0
    const anchorIndex = touch.anchorIndex + dalta
    scrollTo(anchorIndex)
  }

  // 封装滚动
  function scrollTo(index) {
    // index 的值可能是NAN因为 e.target 不一定是li子滚动项,点击外部就可能是div
    if (isNaN(index)) return
    // 超出字母导航 会报错,需要进行index限制
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    // 拿到即将跳转滚动列表的子项 通过index
    const targetEl = groudRef.value.children[index]

    const scroll = scrollRef.value.scroll

    scroll.scrollToElement(targetEl, 0)
  }

  return {
    shortcutList,
    onShortcutTouchStart,
    scrollRef,
    onShortcutTouchMove
  }
}
