<!-- 音乐详情页组件 -->
<template>
  <div>
    <div class="top_warp">
      <div class="back">
        <i @click="Goback" class="icon-back"></i>
      </div>
      <h1 class="title">{{ singerSongList.name }}</h1>
    </div>

    <!-- 封面图 -->
    <div class="singer_pic" :style="bgImg" ref="singerImgRef">
      <div @click="handleRandomPlay" class="play-btn-wrapper">
        <div class="play-btn">
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter"></div>
    </div>
    <!-- 滚动列表(歌曲信息) -->
    <Scroll
      :probe-type="3"
      @scroll="onScroll"
      class="musiclist_wrap"
      :style="StyleimgHeight"
    >
      <div v-no-result="!isResult" class="sinlist_wrap">
        <div>
          <!-- 歌曲列表组件 -->
          <SongList @playList="playList" :hotSongs="singerSongList.hotSongs" />
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script setup lang="ts">
import { SongListType } from "@/types"
import { computed, onMounted, PropType, ref } from "vue"
import SongList from "../SongList/SongList.vue"
import Scroll from "../Scroll/Scroll.vue"
import { useRouter } from "vue-router"
import { useStore } from "@/store/store"
const singerImgRef = ref<HTMLElement | null>(null)
const imgHeight = ref<number | any>(0)
const router = useRouter()
const scrollY = ref(0)
const RESRVED_HEIGHT = 48
const maxTranslateY = ref(0)
const { setPlayList, randomPlay } = useStore()

// 接受singer.vue 父组件传递过来的歌手详情信息
// 包括 name 背景图 和 歌曲列表
const props = defineProps({
  singerSongList: {
    type: Object as PropType<SongListType>,
    required: true
  }
})

// 接受歌曲列表组件派发的emits
// 当前点击的歌曲信息 和 歌曲索引
const playList = (payload) => {
  const list = props.singerSongList.hotSongs
  const { index } = payload
  // randomPlay(list)
  setPlayList(list, index)
}
// 随机播放
const handleRandomPlay = () => {
  const list = props.singerSongList.hotSongs
  randomPlay(list)
}

// 定义监听事件 可以拿到派发的pos
const onScroll = (pos) => {
  scrollY.value = -pos.y
}

onMounted(() => {
  // setTimeout(() => {
  //   console.log("ee", props.singerPic)
  // }, 2300)
  // 拿到封面图高度
  imgHeight.value = singerImgRef.value?.clientHeight
  // 最大滚动值,图片封面高度 减去 顶部栏高度(40)
  maxTranslateY.value = imgHeight.value - RESRVED_HEIGHT
})

// 根据封面图高度 指定top
const StyleimgHeight = computed(() => {
  return {
    top: `${imgHeight.value}px`
  }
})
const isResult: any = computed(() => {
  return props.singerSongList.hotSongs
})

const bgImg = computed(() => {
  const scrolly = scrollY.value

  let paddingTop: string | number = "70%"
  let height: string | number = 0
  let translateZ = 0
  // 默认
  let zIndex = 0
  if (scrolly > maxTranslateY.value) {
    zIndex = 10
    translateZ = 1
    paddingTop = 0
    height = `${RESRVED_HEIGHT}px`
  }
  let scale = 1
  if (scrolly < 0) {
    scale = 1 + Math.abs(scrolly / imgHeight.value)
  }
  return {
    zIndex,
    paddingTop,
    transform: `scale(${scale})translateZ(${translateZ}px)`,
    height,
    backgroundImage: `url(${
      props.singerSongList.pic
        ? props.singerSongList.pic
        : "https://p2.music.126.net/iHVX4p12jdQsyEosLhDGQg==/109951165830678577.jpg"
    })`
  }
})

const Goback = () => {
  router.back()
}
</script>

<style lang="scss">
/* 滚动列表 */
.sinlist_wrap {
  background: $color-background;
  position: relative;
}
/* 顶部 标题 返回箭头 框架 */
.top_warp {
  /* 返回按钮 */
  .back {
    position: absolute;
    top: 12px;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  /* 歌手标题 */
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
}

/* 歌手封面图框架 */
.singer_pic {
  position: relative;
  width: 100%;

  transform-origin: top;
  background-size: cover;

  /* 随机播放按钮 */
  .play-btn-wrapper {
    position: absolute;
    bottom: 20px;
    z-index: 10;
    width: 100%;
    .play-btn {
      box-sizing: border-box;
      width: 135px;
      padding: 7px 0;
      margin: 0 auto;
      text-align: center;
      border: 1px solid $color-theme;
      color: $color-theme;
      border-radius: 100px;
      font-size: 0;
    }
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      font-size: $font-size-small;
    }
  }
  // 蒙层
  .filter {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(7, 17, 27, 0.4);
  }
}
/* 滚动歌曲列表 */
.musiclist_wrap {
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 0;
}
</style>
