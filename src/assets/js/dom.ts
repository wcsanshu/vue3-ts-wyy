// 添加样式
export function addClass(el: any, className: string) {
  // 如果你的class没有包含指定样式
  // 则添加class
  if (!el.classList.contains(className)) {
    el.classList.add(className)
  }
}

// 删除样式
export function removeClass(el: any, className: string) {
  el.classList.remove(className)
}
