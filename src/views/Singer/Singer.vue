<template>
  <!-- 歌手信息页面 -->
  <div class="singer">
    <!-- 歌手滚动列表组件 -->
    <SingerList
      @SingerDetailItem="OnSingerDetailItem"
      :singerList="singerList"
    ></SingerList>

    <!-- 点击进入歌手详情页 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :SingerDetailItem="SingerDetailItem" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
import { getSingerAPI, getSingerSongAPI } from "@/apis"
import { onMounted, ref } from "vue"
import SingerList from "@/components/SingerList/SingerList.vue"
import Filtration from "@/hooks/useFiltration"
import { useRouter } from "vue-router"
import storage from "good-storage"
import { SINGER_KEY } from "@/assets/js/constant"
const singerList = ref<any>([])
const SingerDetailItem = ref({}) // 存储通过歌手id 获取到的歌手详情
const router = useRouter()
// 获取歌手信息
onMounted(async () => {
  const res = await getSingerAPI()
  singerList.value = Filtration(res.data.artists)
})

// 拿到歌手滚动子组件派发的点击项歌手item的信息
const OnSingerDetailItem = async (item) => {
  // 拿到歌手id
  const { pic, name, id } = item

  // 通过id 请求歌手信息
  const res = await getSingerSongAPI(id)
  // 包装歌手信息
  SingerDetailItem.value = {
    id,
    pic,
    name,
    hotSongs: res.data.hotSongs
  }
  // 存储session
  storage.session.set(SINGER_KEY, SingerDetailItem.value)
  // 跳转到歌手详情页
  router.push({
    path: `/singer/${item.id}`
  })
}
</script>

<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
