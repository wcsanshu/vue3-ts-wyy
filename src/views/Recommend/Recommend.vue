<template>
  <!-- 推荐页 -->
  <div class="recommend_wrap">
    <Scroll class="scroll_box">
      <div>
        <!-- 轮播图 -->
        <SwipeL :bannerList="bannerList" />
        <!-- 热门歌单推荐 -->

        <div class="hot_songlist_wrap">
          <span class="hot_title">热门歌单推荐</span>
          <van-skeleton
            v-for="item in hotSonglist"
            :key="item.id"
            avatar
            avatar-shape="square"
            round
            :row="2"
            :loading="!isloading"
          >
            <div class="songlist_inner">
              <VanImage
                round
                class="song__img"
                :src="item.coverImgUrl"
                lazy-load
              />

              <div class="song__text">
                <span class="song_text__title">{{ item.name }}</span>
                <!-- <span class="song_text_describe">{{ item.description }}</span> -->
              </div>
            </div>
          </van-skeleton>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue"
import SwipeL from "@/components/Swipe/Swipe.vue"
import { getBannerAPI, getHotSongAPI } from "@/apis/index"
import { PlaylistType } from "@/types"
import Scroll from "@/components/Scroll/Scroll.vue"
import { Image as VanImage } from "vant"

const bannerList = ref([])
const hotSonglist = ref<PlaylistType[]>([])
const isloading = ref(false)
onMounted(async () => {
  // 获取轮播图
  const res = await getBannerAPI()
  // 获取热门歌单
  const hotSongList = await getHotSongAPI(10)
  hotSonglist.value = hotSongList.data.playlists
  bannerList.value = res.data.banners
  if (res.data.banners) {
    isloading.value = true
  }
})
</script>

<style lang="scss">
.recommend_wrap {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .scroll_box {
    height: 100%;
    overflow: hidden;

    .hot_songlist_wrap {
      display: flex;
      flex-direction: column;
      text-align: center;
      margin-top: 10px;

      .hot_title {
        font-size: $font-size-medium;
        color: $color-theme;
        font-weight: 550;
      }
      .songlist_inner {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        margin-left: 10px;
        .song__img {
          width: 60px;
          height: 60px;
          margin-right: 10px;
          border-radius: 10px;
        }
        .song__text {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          font-size: $font-size-medium;
          .song_text__title {
            margin-bottom: 10px;
          }
          .song_text_describe {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
.van-skeleton__row,
.van-skeleton__title {
  background: rgb(104, 103, 103) !important;
}
</style>
