import { useUserStoreWithOut } from "@/store/store"
import { storeToRefs } from "pinia"
import { computed } from "vue"
import { PLAY_MODE } from "@/assets/js/constant"
export default function useMode() {
  const { playMode } = storeToRefs(useUserStoreWithOut())
  const { changeMode } = useUserStoreWithOut()

  const playModeIcon = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? "icon-sequence"
      : playModeVal === PLAY_MODE.random
      ? "icon-random"
      : "icon-loop"
  })

  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? "顺序播放"
      : playModeVal === PLAY_MODE.random
      ? "随机播放"
      : "单曲循环"
  })

  const handlechangeMode = () => {
    const mode = (playMode.value + 1) % 3 // 0 1 2
    changeMode(mode)
  }

  // 关闭或者开启播放列表
  const playListShow = (show: false) => {
    return show
  }
  return {
    playModeIcon,
    handlechangeMode,
    modeText,
    playListShow
  }
}
