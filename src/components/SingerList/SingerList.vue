<template>
  <!-- 歌手信息滚动组件 -->
  <Scroll
    @scroll="onScroll"
    ref="scrollRef"
    :probe-type="3"
    class="scroll_singer"
  >
    <ul ref="groudRef">
      <li class="group" v-for="item in singerList" :key="item.title">
        <!-- 标签A-Z -->
        <span class="sort_title">
          {{ item.title }}
        </span>
        <ul>
          <li
            class="singer_item"
            v-for="singer in item.list"
            @click="goSingerDetail(singer)"
            :key="singer.id"
          >
            <VanImage
              fit="cover"
              class="singer__avatar"
              round
              :src="singer.pic"
            />
            <!-- <img class="singer__avatar" :src="singer.pic" /> -->

            <span class="singer__name">
              {{ singer.name }}
            </span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 吸顶标题 -->
    <div :style="fixedStyle" v-show="fiexdTitle" class="fixed">
      <div class="fixed_title">{{ fiexdTitle }}</div>
    </div>
    <!-- 右侧字母导航栏 -->
    <div
      @touchstart.stop.prevent="onShortcutTouchStart"
      @touchmove.stop.prevent="onShortcutTouchMove"
      @touchend.stop.prevent
      class="shortcut"
    >
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="index"
          :data-index="index"
          class="item"
          :class="{ current: currentIndex === index }"
        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script setup lang="ts">
import { PropType } from "vue"
import { SingerListType } from "@/types"
import { Image as VanImage } from "vant"
import Scroll from "@/components/Scroll/Scroll.vue"
import useFixed from "@/hooks/useFixed"
import useShortCut from "@/hooks/useShortcut"

const props = defineProps({
  singerList: {
    type: Array as PropType<SingerListType[]>,
    required: true
  }
})

// 派发emits 事件
const emits = defineEmits(["SingerDetailItem"])
// 用户点击某一项时,派发某一项信息
const goSingerDetail = (item) => {
  emits("SingerDetailItem", item)
}

const { groudRef, onScroll, fiexdTitle, fixedStyle, currentIndex } =
  useFixed(props)

const { shortcutList, onShortcutTouchStart, scrollRef, onShortcutTouchMove } =
  useShortCut(props, groudRef)
</script>

<style lang="scss" scoped>
.shortcut {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  padding: 20px 0;
  border-radius: 10px;
  text-align: center;
  background: $color-background-d;
  font-family: Helvetica;
  .item {
    padding: 3px;
    line-height: 1;
    color: $color-text-l;
    font-size: $font-size-small;
    &.current {
      color: $color-theme;
    }
  }
}
.group {
  padding-bottom: 10px;
}
.scroll_singer {
  position: relative;
  width: 100%;
  height: 100%;
  background: $color-background;
  overflow: hidden;

  .sort_title {
    display: block;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background: $color-highlight-background;
  }
  .singer_item {
    display: flex;
    align-items: center;
    padding: 20px 0 0 20px;
    .singer__name {
      margin-left: 20px;
      color: $color-text-l;
      font-size: $font-size-medium;
    }
    .singer__avatar {
      width: 50px;
      height: 50px;
      border-radius: 50%;
    }
  }
  .fixed {
    position: absolute;
    top: 0px;
    left: 0;
    width: 100%;
  }
  .fixed_title {
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
    font-size: $font-size-small;
    color: $color-text-l;
    background-color: $color-highlight-background;
  }
}
</style>
