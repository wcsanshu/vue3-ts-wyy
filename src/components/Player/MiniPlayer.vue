<template>
  <!-- 迷你播放器 -->
  <transition name="mini">
    <div v-show="!fullscreen" @click="showMinPlayer" class="mini-player">
      <div class="cd-wrapper">
        <div ref="cdRef" class="cd">
          <img
            ref="cdImgRef"
            :class="cdCls"
            width="40"
            height="40"
            :src="currentSongPic"
          />
        </div>
      </div>

      <div ref="sliderWrapperRef" class="slider-wrapper">
        <div class="slider-group">
          <div class="slider-page">
            <h2 class="name">{{ currentSong.name }}</h2>
            <p class="desc">{{ currentSongDes }}</p>
          </div>
        </div>
      </div>
      <div class="control">
        <progress-circle :progress="progress" :radius="32">
          <i
            class="icon-mini"
            :class="miniPlayIcon"
            @click.stop="togglePlay"
          ></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="handleIsshow">
        <i class="icon-playlist"></i>
      </div>
    </div>
  </transition>
  <PlayList ref="playlistRef" />
</template>

<script setup lang="ts">
import { useStore } from "@/store/store"

import { storeToRefs } from "pinia"
import { computed, watch, ref, PropType } from "vue"
import useCd from "./useCd"
import ProgressCircle from "./ProgressCircle.vue"
import PlayList from "./PlayList.vue"
const { fullscreen, currentSong } = storeToRefs(useStore())
const { setFullScreen } = useStore()
const { playing } = storeToRefs(useStore())
const currentSongPic = ref("")
const currentSongDes = ref("")
const playlistRef = ref<any>(null)
defineProps({
  progress: {
    type: Number,
    default: 0
  },
  togglePlay: {
    type: Function as PropType<(payload: MouseEvent) => void>
  }
})

const handleIsshow = () => {
  playlistRef.value.HandleShow()
}

const miniPlayIcon = computed(() => {
  return playing.value ? "icon-pause-mini" : "icon-play-mini"
})

// 监听歌曲信息的改变,来重新赋值
watch(currentSong, (newCurrent) => {
  if (!newCurrent.id) return
  currentSongPic.value = newCurrent.al.picUrl
  console.log(currentSongPic.value)
  currentSongDes.value = newCurrent.al.name
})

const { cdCls, cdImgRef, cdRef } = useCd()

const showMinPlayer = () => {
  setFullScreen(true)
}
</script>

<style lang="scss">
.mini-player {
  display: flex;
  align-items: center;
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 180;
  width: 100%;
  height: 60px;
  background: $color-highlight-background;
  .cd-wrapper {
    flex: 0 0 40px;
    width: 40px;
    height: 40px;
    padding: 0 10px 0 15px;
    .cd {
      height: 100%;
      width: 100%;
      img {
        border-radius: 50%;
        &.playing {
          animation: rotate 10s linear infinite;
        }
        &.pause {
          animation-play-state: paused;
        }
      }
    }
  }
  .slider-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    overflow: hidden;
    .slider-group {
      position: relative;
      overflow: hidden;
      white-space: nowrap;

      .slider-page {
        display: inline-block;
        width: 100%;
        height: 100%;
        transform: translate3d(0, 0, 0);
        backface-visibility: hidden;
        .name {
          margin-bottom: 2px;
          @include no-wrap();
          padding-top: 10px;
          font-size: $font-size-medium;
          color: $color-text;
        }
        .desc {
          @include no-wrap();
          font-size: $font-size-small;
          color: $color-text-d;
        }
      }
    }
  }
  .control {
    flex: 0 0 30px;
    width: 30px;
    padding: 0 10px;
    .icon-playlist {
      position: relative;
      top: -2px;
      font-size: 28px;
      color: $color-theme-e;
    }
    .icon-mini {
      position: absolute;
      left: 0;
      top: 0;
      color: $color-theme-d;
      font-size: 32px;
    }
  }
  &.mini-enter-active,
  &.mini-leave-active {
    transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
  }
  &.mini-enter-from,
  &.mini-leave-to {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
}
</style>
