<!-- 歌曲信息列表组件 -->
<template>
  <div v-for="(item, index) in hotSongs" :key="item.id" class="list_wrap">
    <div @click="playSong(item, index)" class="songlist_inner">
      <span class="sing_name">{{ item.name }}</span>
      <span class="sing_describe">{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { HotSongsType } from "@/types"
import { PropType } from "vue"

// 当前组件只管渲染歌曲列表
// 接受一个歌曲列表,其他不管
defineProps({
  hotSongs: {
    type: Array as PropType<HotSongsType[]>,
    required: true
  }
})
const emits = defineEmits(["playList"])

// 把当前的索引派发给musicList
const playSong = (item, index: number) => {
  const payload = {
    index,
    item
  }
  emits("playList", payload)
}
</script>

<style lang="scss">
.list_wrap {
  padding-top: 10px;
  box-sizing: border-box;
  height: 64px;
  font-size: $font-size-medium;
  .songlist_inner {
    display: flex;
    line-height: 20px;
    flex-direction: column;
    justify-content: center;
    overflow: hidden;
    padding: 0 15px;
    .sing_name {
      @include no-wrap();
      color: $color-text;
    }
    .sing_describe {
      @include no-wrap();
      margin-top: 4px;
      color: $color-text-d;
    }
  }
}
</style>
