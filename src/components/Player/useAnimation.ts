import { ref } from "vue"
import animations from "create-keyframe-animation"
/**
 * JavaScript 钩子 动画实现
 * 主要用于 播放器页面
 * 分为两个部分:
 *   . 一是进入动画
 *   . 二是离开动画
 */
export default function useAnimation() {
  const cdWrapperRef = ref<HTMLDivElement | null>()
  let entering = false
  let leaving = false
  // 在元素被插入到 DOM 之后的下一帧被调用
  // 用这个来开始进入动画
  function enter(el, done) {
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { x, y, scale } = getPosAndScale()
    const animation = {
      // 定义开始位置
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      // 结束位置
      100: {
        transform: "translate3d(0, 0, 0) scale(1)"
      }
    }
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 600,
        easing: "cubic-bezier(0.45, 0, 0.55, 1)"
      }
    })
    animations.runAnimation(cdWrapperRef.value, "move", done)
  }

  // 当进入过渡完成时调用。
  function afterEnter() {
    entering = false
    animations.unregisterAnimation("move")
    cdWrapperRef.value!.style.animation = ""
  }

  // 在离开过渡开始时调用
  // 用这个来开始离开动画
  function leave(el, done) {
    // 如果我们离开时进入动画还未完毕
    // 手动执行清理函数
    if (entering) {
      afterEnter()
    }
    leaving = true
    const { x, y, scale } = getPosAndScale()
    const cdWrapperEL = cdWrapperRef.value
    cdWrapperEL!.style.transition = "all .6s cubic-bezier(0.45, 0, 0.55, 1)"
    cdWrapperEL!.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
    cdWrapperEL!.addEventListener("transitionend", next)

    function next() {
      cdWrapperEL?.removeEventListener("transitionend", next)
      done()
    }
  }

  // 在离开过渡完成、
  // 且元素已从 DOM 中移除时调用
  function afterLeave() {
    leaving = false
    const cdWrapperEL = cdWrapperRef.value
    cdWrapperEL!.style.transition = ""
    cdWrapperEL!.style.transform = ""
  }

  function getPosAndScale() {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    console.log("屏幕高度", window.innerHeight)
    console.log("二分之一宽度", width / 2)

    const x = -(window.innerWidth / 2 - paddingLeft)
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom
    const scale = targetWidth / width
    return {
      x,
      y,
      scale
    }
  }

  return {
    enter,
    afterEnter,
    cdWrapperRef,
    afterLeave,
    leave
  }
}
