import { createApp } from "vue"
import { addClass, removeClass } from "@/assets/js/dom"

const reactiveCls = `g-relative`
// 接受一个指令
export default function createLoadingDirective(Comp) {
  return {
    mounted(el: any, binding: any) {
      const app = createApp(Comp)
      const instance = app.mount(document.createElement("div")) // loading组件
      const name = Comp.name
      if (!el[name]) {
        el[name] = {}
      }
      el[name].instance = instance
      if (binding.value) {
        append(el)
      }
    },
    // 组件更新逻辑
    updated(el: any, binding: any) {
      if (binding.value !== binding.oldValue) {
        // true 则添加dom  false 则 删除dom
        binding.value ? append(el) : remove(el)
      }
    }
  }

  function append(el: any) {
    const style = getComputedStyle(el) // 动态拿到style

    // loading 组件的样式 要求 使用v-loading指令的组件 必须是 以下其中一个
    // 所以 我们需要判断并且自动添加 定位css
    if (["absolute", "fixed", "relative"].indexOf(style.position) === -1) {
      addClass(el, reactiveCls)
    }
    const name = Comp.name
    // el 是v-loading 挂载的 dom元素
    // el.instance.$el 是loading 的dom元素
    // 这段代码就是把loading组件 挂载到设置v-loading 的组件上
    el.appendChild(el[name].instance.$el)
  }
  function remove(el: any) {
    const name = Comp.name
    el.removeChild(el[name].instance.$el)
  }
}
