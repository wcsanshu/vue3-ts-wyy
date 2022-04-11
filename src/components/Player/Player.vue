<template>
  <div class="player" v-show="playlist.length">
    <transition
      @enter="enter"
      @afterEnter="afterEnter"
      @afterLeave="afterLeave"
      @leave="leave"
      name="normal"
    >
      <!-- 播放器组件 -->

      <div v-show="fullscreen" class="player_inner">
        <div class="background">
          <img :src="songPic" alt="" />
        </div>
        <div class="top">
          <div class="back">
            <i @click="goBack" class="icon-back"> </i>
          </div>
          <div class="title_inner">
            <span class="song_title">{{ songName }}</span>
            <span class="subtitle">{{ singerName }}</span>
          </div>
        </div>
        <!-- 旋转唱片 -->
        <div class="middle">
          <div class="middle-l">
            <!-- 唱片主题 -->
            <div ref="cdWrapperRef" class="cd-wrapper">
              <div ref="cdRef" class="cd">
                <img
                  ref="cdImgRef"
                  :class="cdCls"
                  class="imgage"
                  :src="songPic"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <!-- 进度条 -->
          <div class="progress-wrapper">
            <!-- 歌曲已播放时长 -->
            <span class="time time-l">{{ formatTime(currentTime) }}</span>
            <div class="progress-bar-wrapper">
              <!-- 进度条组件 -->
              <ProgressBar
                ref="barRef"
                @progress-changing="onProgressChanging"
                @progress-changed="onProgressChanged"
                :progress="progress"
              />
            </div>
            <!-- 歌曲总时长 -->
            <span class="time time-r">{{ formatTime(currentSongDT) }}</span>
          </div>

          <div class="operators">
            <!-- 播放模式按钮 -->
            <div @click="handlechangeMode" class="icon i-left">
              <i :class="playModeIcon"></i>
            </div>
            <!-- 上一首 -->
            <div @click="prev" class="icon i-left" :class="disableCls">
              <i class="icon-prev"></i>
            </div>
            <!-- 播放按钮 -->
            <div @click="togglePlay" class="icon i-center" :class="disableCls">
              <i :class="playIcon"></i>
            </div>
            <!-- 下一首按钮 -->
            <div @click="next" class="icon i-right" :class="disableCls">
              <i class="icon-next"></i>
            </div>
            <!-- 收藏按钮 -->
            <div class="icon i-right">
              <i
                @click="toggleFavorite(currentSong)"
                :class="getFavoriteIcon(currentSong)"
              ></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <MiniPlayer :togglePlay="togglePlay" :progress="progress"> </MiniPlayer>
    <audio
      @canplay="ready"
      @error="error"
      @pause="pause"
      ref="audioRef"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>
  </div>
</template>

<script setup lang="ts">
import { getSongUrlAPI } from "@/apis"
import { useStore } from "@/store/store"
import { storeToRefs } from "pinia"
import { computed, nextTick, ref, watch } from "vue"
import useFavorite from "./useFavorite"
import useMode from "./useMode"
import ProgressBar from "./ProgressBar.vue"
import { formatTime } from "@/utils/formatTime"
import { PLAY_MODE } from "@/assets/js/constant"
import useCd from "./useCd"
import MiniPlayer from "./MiniPlayer.vue"
import useAnimation from "./useAnimation"

const store = useStore()
// 获取是否全屏 和 getters的当前播放歌曲信息currentSong playing是否正在播放
const { fullscreen, currentSong, playing, currentIndex, playlist, playMode } =
  storeToRefs(store)
const { setFullScreen, setPlayingState, setCurrentIndex } = store // 修改全屏
const audioRef = ref<any>(null)
const songName = ref("") // 歌曲名字
const singerName = ref("") // 歌手名字
const songPic = ref("") // 歌曲封面
const songReady = ref(false) // 是否准备完毕
const currentTime = ref(0) // 当前歌曲播放时间
const currentSongDT = ref(0) // 当前播放歌曲的总时长
const proChanging = ref(false)
const barRef = ref<any>(null) // 拿到进度条组件的dom

// 控制播放列表开启or关闭
// 拿到当前播放歌曲信息 监听
// 当发生改变则通过id请求音乐接口
// currentSong为获取到的当前播放歌曲的信息
watch(currentSong, async (newVal: any) => {
  if (!newVal.id) return
  songReady.value = false
  currentTime.value = 0
  songPic.value = newVal.al.picUrl
  currentSongDT.value = newVal.dt * 0.001
  const audioEL = audioRef.value // 拿到播放器dom
  songName.value = newVal.name // 拿到歌曲名字
  singerName.value = newVal.ar[0].name // 拿到歌手名字
  const songId = newVal.id // 拿到歌曲id
  const res = await getSongUrlAPI(songId) // 使用id请求接口拿到url
  audioEL!.src = res.data.data[0].url // 播放器写入url
  audioEL!.play()
  setPlayingState(true)
})

// 监听播放状态来播放或者暂停歌曲
watch(playing, (newPlaying) => {
  if (!songReady.value) return
  const audioEL = audioRef.value
  newPlaying ? audioEL!.play() : audioEL!.pause()
})

watch(fullscreen, async (newFullscreen) => {
  if (newFullscreen) {
    await nextTick()
    barRef.value?.setOffset(progress.value)
  }
})

// 通过不同的播放状态 显示不同的class图标
const playIcon = computed(() => (playing.value ? "icon-pause" : "icon-play"))
// 判断播放器是否准备中 准备中则禁用
const disableCls = computed(() => {
  return songReady.value ? "" : "disable"
})

// 歌曲的播放进度
// 歌曲已播放时间 除于 总时间
const progress = computed(() => {
  return currentTime.value / Math.floor(currentSongDT.value)
})

// 钩子函数中拿到播放图标切换功能 和 播放模式切换功能
const { playModeIcon, handlechangeMode } = useMode()
// 钩子函数中拿到收藏图标切换功能,和收藏功能
const { toggleFavorite, getFavoriteIcon } = useFavorite()
const { cdCls, cdRef, cdImgRef } = useCd()
const { cdWrapperRef, enter, afterEnter, leave, afterLeave } = useAnimation()
// 修改播放状态
const togglePlay = () => {
  setPlayingState(!playing.value)
}
// 原生事件,电脑暂停或待机时设置暂停播放
const pause = () => {
  setPlayingState(false)
}
const updateTime = (e) => {
  if (!proChanging.value) {
    currentTime.value = e.target.currentTime
  }
}

// 上一首
const prev = () => {
  let index = currentIndex.value - 1
  const list = playlist.value // 拿到列表
  if (!songReady.value || list.length === 0) return // 为0 则返回
  // 如果歌曲列表只有一首
  if (list.length === 1) {
    loop() // 触发循环播放
  }
  if (index === -1) {
    // 如果列表已经到了第一首
    index = list.length - 1 // 定位到列表尾部
  }
  setCurrentIndex(index) // 修改索引
  if (!playing.value) {
    // 如果处于暂停状态则播放
    setPlayingState(!playing.value)
  }
}

// 下一首
const next = () => {
  const list = playlist.value
  if (!songReady.value || list.length === 0) return
  // 如果歌曲列表只有一首
  if (list.length === 1) {
    loop() // 触发循环播放
  }

  let index = currentIndex.value + 1
  if (index === playlist.value.length) {
    index = 0
  }
  setCurrentIndex(index)

  if (!playing.value) {
    setPlayingState(!playing.value)
  }
}

// 只有音乐播放器准备完成后才会执行
function ready() {
  console.log("ready")

  if (songReady.value) return // 已经准备过则返回
  songReady.value = true
}

// 发生错误 准备状态设置为true 不设置则一直播放不了
const error = () => {
  songReady.value = true
}

const loop = () => {
  const audioEL = audioRef.value
  audioEL.currentTime = 0
  audioEL.play()
}

const goBack = () => {
  setFullScreen(false)
}

const onProgressChanged = (pro) => {
  proChanging.value = false
  audioRef.value.currentTime = currentTime.value = currentSongDT.value * pro
  if (!playing.value) {
    setPlayingState(true)
  }
}

function end() {
  currentTime.value = 0
  if (playMode.value === PLAY_MODE.loop) {
    loop()
  } else {
    next()
  }
}

const onProgressChanging = (pro) => {
  proChanging.value = true
  currentTime.value = currentSongDT.value * pro
}
</script>

<style lang="scss">
.player_wrap {
  display: flex;
}

.normal-enter-active,
.normal-leave-active {
  transition: all 0.6s;
  .top,
  .bottom {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
}
.normal-enter-from,
.normal-leave-to {
  opacity: 0;
  .top {
    transform: translate3d(0, -100px, 0);
  }
  .bottom {
    transform: translate3d(0, 100px, 0);
  }
}
.player_inner {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 300;
  background: $color-background;

  .top {
    position: relative;
    margin-bottom: 25px;
    .back {
      position: absolute;
      top: 0;
      left: 6px;
      z-index: 50;

      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
    }
  }

  .title_inner {
    display: flex;
    flex-direction: column;
  }

  .song_title {
    margin: 0 auto;
    line-height: 40px;
    text-align: center;
    @include no-wrap();
    font-size: 15px;
    color: $color-text;
  }

  .subtitle {
    line-height: 20px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text;
  }

  .background {
    position: absolute;
    left: 0;
    top: -300;
    width: 100%;
    height: 100%;
    z-index: -1;
    opacity: 0.6;
    filter: blur(20px);

    img {
      width: 100%;
      height: 100%;
    }
  }
  .bottom {
    position: absolute;
    bottom: 50px;
    width: 100%;

    .progress-wrapper {
      display: flex;
      align-items: center;
      width: 80%;
      margin: 0px auto;
      padding: 10px 0;
      .time {
        color: $color-text;
        font-size: $font-size-small;
        flex: 0 0 40px;
        line-height: 30px;
        width: 40px;
        &.time-l {
          text-align: left;
        }
        &.time-r {
          text-align: right;
        }
      }
      .progress-bar-wrapper {
        flex: 1;
      }
    }
  }
}

.operators {
  display: flex;
  align-items: center;
  .icon {
    flex: 1;
    color: $color-theme;
    &.disable {
      color: $color-theme-d;
    }
    i {
      font-size: 30px;
    }
  }
  .i-left {
    text-align: right;
  }
  .i-center {
    padding: 0 20px;
    text-align: center;
    i {
      font-size: 40px;
    }
  }
  .i-right {
    text-align: left;
  }
  .icon-favorite {
    color: $color-sub-theme;
  }
}

/* 唱片 */
.middle {
  position: fixed;
  width: 100%;
  top: 130px;
  bottom: 170px;
  white-space: nowrap;
  font-size: 0;
  .middle-l {
    display: inline-block;
    vertical-align: top;
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 80%;
    .cd-wrapper {
      position: absolute;
      left: 10%;
      top: 0;
      width: 80%;
      box-sizing: border-box;
      height: 100%;
      .cd {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        img {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
        }
        /* 旋转 rotate 已在base定义 */
        .playing {
          animation: rotate 20s linear infinite;
        }
      }
    }
    .playing-lyric-wrapper {
      width: 80%;
      margin: 30px auto 0 auto;
      overflow: hidden;
      text-align: center;
      .playing-lyric {
        height: 20px;
        line-height: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
    }
  }
  .middle-r {
    display: inline-block;
    vertical-align: top;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .lyric-wrapper {
      width: 80%;
      margin: 0 auto;
      overflow: hidden;
      text-align: center;
      .text {
        line-height: 32px;
        color: $color-text-l;
        font-size: $font-size-medium;
        &.current {
          color: $color-text;
        }
      }
      .pure-music {
        padding-top: 50%;
        line-height: 32px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
}
</style>
