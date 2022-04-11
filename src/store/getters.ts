// 通过计算出当前播放的歌曲
export const currentSong = (state) => {
  return state.palyList[state.currentIndex] || {}
}

//
