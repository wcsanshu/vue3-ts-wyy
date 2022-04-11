// 秒转换为 00:00
export function formatTime(interval) {
  interval = interval | 0
  const minute = (((interval / 60) | 0) + "").padStart(2, "0")
  const second = ((interval % 60) + "").padStart(2, "0")
  return `${minute}:${second}`
}

// 毫秒转换为00:00
export function formatTimeSS(msTime) {
  const time = msTime / 1000

  // const day = Math.floor(time / 60 / 60 / 24)

  // const hour = Math.floor(time / 60 / 60) % 24

  const minute = Math.floor(time / 60) % 60

  const second = Math.floor(time) % 60

  return `${minute}:${second}`
}
