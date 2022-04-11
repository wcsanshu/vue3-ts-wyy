<template>
  <div class="swipe_wrap">
    <Swipe
      class="swipe_inner"
      lazy-render
      :autoplay="3000"
      indicator-color="white"
    >
      <SwipeItem v-for="item in bannerList" :key="item.encodeId">
        <img class="swipe_img" :src="item.imageUrl" alt="" />
      </SwipeItem>
    </Swipe>
  </div>
</template>

<script setup lang="ts">
import { Swipe, SwipeItem } from "vant"
import { BannerType } from "@/types"
import { PropType } from "vue"
const props = defineProps({
  bannerList: {
    type: Array as PropType<BannerType[]>,
    required: true
  }
})
setTimeout(() => {
  console.log(props.bannerList)
}, 2000)
</script>

<style lang="scss">
.swipe_wrap {
  margin-top: 5px;
  .swipe_inner {
    .swipe_img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
