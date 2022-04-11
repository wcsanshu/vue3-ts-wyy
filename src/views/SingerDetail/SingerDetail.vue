<template>
  <!-- 歌手详情页面 -->
  <div class="detail_wrap">
    <MusicList :singerSongList="computedSinger"></MusicList>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue"
import { SINGER_KEY } from "@/assets/js/constant"
import createDetailComponents from "@/components/js/create-detail-components"
export default defineComponent(createDetailComponents("detail", SINGER_KEY))
</script>

<!-- <script setup lang="ts">
import { computed, ref } from "vue"
import MusicList from "@/components/MusciList/MusicList.vue"
import storage from "good-storage"
import { SINGER_KEY } from "@/assets/js/constant"
import { useRoute, useRouter } from "vue-router"
const route = useRoute()

const props = defineProps({
  // 歌手信息详情
  SingerDetailItem: {
    type: Object,
    required: true
  }
})

const singerSongList = computed(() => props.SingerDetailItem)

const computedSinger = computed(() => {
  let res: any = null
  // 如果有没有props 则 从session 取
  const singer = singerSongList.value

  if (!singer.id) {
    const routeID = +route.params.id
    console.log(routeID)
    console.log("没有", singer)
    const cachedSinger = storage.session.get(SINGER_KEY)
    // 取到与当前歌手id相符的session信息
    if (cachedSinger && cachedSinger.id === routeID) {
      res = cachedSinger
    }
  } else {
    // 如果有props 则正常赋值 返回
    res = singer
  }

  return res
})
</script> -->

<style lang="scss" scoped>
.detail_wrap {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: $color-background;
}
</style>
