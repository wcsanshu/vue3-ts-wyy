import storage from "good-storage"

export function save(item, key, compare) {
  // 首先获取本地存储的(收藏)的歌曲信息
  const items = storage.get(key, [])
  // 传递获取到的存储信息或[],第二个参数为当前即将要收藏的歌曲
  // 第三个参数为 自定义的函数规则 (具体实现是外部实现的)
  // 执行以下函数后如果要收藏的歌曲不在本地缓存歌曲内
  // 则添加收藏(添加缓存) item的内容添加的items里
  inertArray(items, item, compare)
  storage.set(key, items)
  return items
}

function inertArray(items, item, compare) {
  const index = items.findIndex(compare)
  if (index > -1) {
    // 大于-1说明找到了,则返回(不需要重复添加)
    return
  }
  items.unshift(item)
}

export function remove(key, compare) {
  const items = storage.get(key, [])
  deleteFromArray(items, compare)
  storage.set(key, items)
  return items
}

function deleteFromArray(items, compare) {
  const index = items.findIndex(compare)
  if (index > -1) {
    items.splice(index, 1)
  }
}

export function load(key) {
  return storage.get(key, [])
}
