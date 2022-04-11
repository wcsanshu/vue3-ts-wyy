import { computed, nextTick, ref, watch } from "vue"

/**
 * 首先要获取歌手列表的高度的区间 calculate函数
 * 然后我们再去监听滚动事件拿到实时滚动位置 由scroll插件完成通过emits派发  onScroll()负责接受
 * 然后watch监听滚动位置,当滚动的时候利用元素的高度和滚动的值进行判断
 * 判断滚动位置落在了哪个区间内,落到哪个区间说明是当前区间 然后拿到索引
 * 然后通过索引就可以求得 当前组标题是什么
 */
export default function useFixed(props) {
  // 拿到dom
  const groudRef = ref<HTMLElement | null>(null)

  // 存储每一个组的高度区间
  const listHeights = ref<any>([])
  const scrollY = ref(0) // 纵向滚动值
  const currentIndex = ref(0)
  const distance = ref(0)
  const TITLE_HEIGHT = 30

  // 根据索引拿到指定title
  const fiexdTitle = computed(() => {
    if (scrollY.value < 0) return ""
    const currentGroup = props.singerList[currentIndex.value]
    return currentGroup ? currentGroup.title : ""
  })

  // 交互优化,滑动顶部动画
  const fixedStyle = computed(() => {
    const distanceVal = distance.value
    const diff =
      distanceVal > 0 && distanceVal < TITLE_HEIGHT
        ? distanceVal - TITLE_HEIGHT
        : 0
    return {
      transform: `translate3d(0,${diff}px,0)`
    }
  })

  // 当歌手数据变化的时候执行下方的计算函数
  watch(
    () => props.singerList,
    async () => {
      await nextTick()
      calculate()
    }
  )

  // 监听 scrollY 的变化 纵向滚动值
  // scroll发生变化时 拿到新的值 然后判断对比
  watch(scrollY, (newY) => {
    const listHeightVal = listHeights.value // dom组件的高度

    // 开始遍历dom元素的高度
    // 这里为什么要减 1 因为我们 listHeights 一开始push 了 0 所以长度比 scrollY大一个
    for (let i = 0; i < listHeightVal.length - 1; i++) {
      // 拿到第一项 为顶部
      const heightTop = listHeightVal[i]

      // 第二项为尾部 这就是整个元素的 高度区间
      const heightBottom = listHeightVal[i + 1]
      // 如果滚动值 等于或者大于顶部值 或者 小于等于底部值 则说明进入区间内
      if (newY >= heightTop && newY <= heightBottom) {
        currentIndex.value = i
        distance.value = heightBottom - newY
      }
    }
  })

  // 计算列表的高度
  // 通过 ref 获取dom
  function calculate() {
    // children 是ref挂载dom子级的每一项元素
    const list = groudRef.value?.children

    const listHeightVal = listHeights.value
    let height = 0

    // 通过遍历拿到每一组的高度区间并且存储
    listHeightVal.length = 0 // 初始化
    listHeightVal.push(height) // 存储

    // 开始遍历
    for (let i = 0; i < list!.length; i++) {
      height += list![i].clientHeight // 拿到子级DOM的高度
      listHeightVal.push(height)
    }
  }

  // 拿到scroll滚动组件通过emits派发的实时滚动位置
  function onScroll(pos) {
    // 因为scroll组件派发是从零开始然后下面全是负值  我们则需要正值来进行比对判断
    // 所以我们直接取 负值 这样scrollY 就是正值了
    scrollY.value = -pos.y
  }
  return {
    groudRef,
    onScroll,
    fiexdTitle,
    fixedStyle,
    currentIndex
  }
}
