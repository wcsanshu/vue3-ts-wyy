import { shuffie } from "@/utils/shuffle"
import { defineStore } from "pinia"
import { store } from "./index"
import { FAVORITE_KEY, PLAY_MODE } from "@/assets/js/constant"
import { load } from "@/hooks/useArrayStore"

export const useStore = defineStore("defaultStore", {
  state: () => {
    return {
      sequenclList: [], // 顺序播放列表
      playlist: [], // 正在播放列表 (当前歌单(或歌手)下的所有歌曲列表)
      playing: false, // 是否正在播放
      playMode: PLAY_MODE.loop, // 当前播放模式
      currentIndex: 0, // 播放歌曲索引
      fullscreen: false, // 当前播放是否全屏
      favoriteList: load(FAVORITE_KEY) // 用户收藏歌曲列表
    }
  },
  actions: {
    // 修改是否正在播放
    setPlayingState(playing: boolean) {
      this.playing = playing
    },
    // 设置顺序播放列表
    setSquenceList(list) {
      this.sequenclList = list
    },
    // 播放
    setPlayList(list, index?) {
      this.playlist = list // 播放列表设置
      this.setPlayingState(true) // 状态修改为播放
      this.setSquenceList(list) // 顺序播放
      this.setFullScreen(true) // 设置全屏
      this.setCurrentIndex(index) // 拿到播放索引
      this.setPlayMode(PLAY_MODE.sequence) // 设置顺序播放
    },
    // 歌曲随机播放
    randomPlay(list) {
      this.playlist = shuffie(list) // 播放列表随机
      this.setPlayMode(PLAY_MODE.random) // 设置随机播放
      this.setFullScreen(true) // 设置全屏
      this.setSquenceList(list) // 顺序播放
      this.setPlayingState(true) // 状态修改为播放
      this.setCurrentIndex(0) // 拿到播放索引
    },
    // 设置播放模式
    setPlayMode(mode) {
      this.playMode = mode
    },
    // 设置当前播放索引
    setCurrentIndex(index) {
      this.currentIndex = index
    },
    // 设置全屏或者收缩
    setFullScreen(fullScreen) {
      this.fullscreen = fullScreen
    },
    // 修改播放模式
    changeMode(mode) {
      const list: any = this.sequenclList
      const currentId = this.currentSong.id

      // 如果是随机播放
      if (mode === PLAY_MODE.random) {
        // 把当前播放列表设置为随机
        this.playlist = shuffie(list)
      } else {
        // 把当前播放列表设置为顺序
        this.playlist = list
      }
      const index = this.playlist.findIndex((song: any) => {
        return song.id === currentId
      })
      this.setCurrentIndex(index)
      // 记得修改模式
      this.setPlayMode(mode)
    },
    // 收藏歌曲
    Setfavorite(list) {
      this.favoriteList = list
    },

    // 删除歌曲项
    removeSong(song) {
      console.log(this.currentIndex)
      // 拿到当前播放列表
      const playlist = this.playlist.slice()
      // 拿到顺序播放列表
      const sequenclList = this.sequenclList.slice()

      // 查找传递过来的id索引 进行匹配
      const playListIndex = this.findIndex(playlist, song)
      // 查找传递过来的id索引 进行匹配
      const sequenclListIndex = this.findIndex(sequenclList, song)
      if (sequenclListIndex === -1 || playListIndex === -1) return
      // 找到则删除索引
      playlist.splice(playListIndex, 1)
      sequenclList.splice(sequenclListIndex, 1)
      // 如果删除的索引 小于 正在播放的索引 则 --
      let currentIndex = this.currentIndex
      if (playListIndex < currentIndex || currentIndex === playlist.length) {
        currentIndex--
      }
      // 重新赋值
      this.playlist = playlist
      this.sequenclList = sequenclList
      this.currentIndex = currentIndex
      // 删除到最后一项 则 播放为false
      if (playlist.length === 0) {
        this.setPlayingState(false)
      }
    },
    findIndex(list, song) {
      return list.findIndex((item) => item.id === song.id)
    },
    // 清空播放列表
    clearPlayList() {
      this.playlist = []
      this.sequenclList = []
      this.setPlayingState(false)
      this.setCurrentIndex(0)
    }
  },

  getters: {
    currentSong(state): any {
      return state.playlist[state.currentIndex] || {}
    }
  }
})
// 在vue的语法之外使用pinia (ts,js)
export function useUserStoreWithOut() {
  return useStore(store)
}
