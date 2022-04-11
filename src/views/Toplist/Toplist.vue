<template>
  <div class="toplist_wrap">
    <Scroll class="toplist_inner">
      <ul>
        <li v-for="item in Toplist.list" :key="item.id" class="item">
          <div class="updateFrequency">
            <span>{{ item.updateFrequency }}</span>
          </div>
          <!-- 排行榜封面图 -->
          <img class="topImg" :src="item.coverImgUrl" alt="" />
          <div class="song_list">
            <div v-for="(tracks, index) in item.tracks" :key="index">
              <span>{{ index + 1 }}. </span>
              <span>{{ tracks.first }}</span>
            </div>
          </div>
        </li>
      </ul>
    </Scroll>
  </div>
</template>

<script lang="ts">
import { getToplist, getToplistAbstract } from "@/apis"
import { defineComponent, ref, onMounted } from "vue"
import Scroll from "@/components/Scroll/Scroll.vue"
export default defineComponent({
  name: "Toplist",
  components: { Scroll },
  setup() {
    const Toplist = ref([]) // 排行榜数据

    onMounted(async () => {
      const res = await getToplistAbstract()
      console.log(res.data)
      // const info = await getPlayListAPI()
      // topAbstract.value = abstract.data
      Toplist.value = res.data
    })
    return {
      Toplist
    }
  }
})
</script>

<style lang="scss">
.toplist_wrap {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .toplist_inner {
    height: 100%;
    overflow: hidden;
    .item {
      position: relative;
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      .topImg {
        width: 100px;
        height: 100px;
      }
      &:last-child {
        padding-bottom: 20px;
      }
      .updateFrequency {
        position: absolute;
        right: 8px;
        top: 23px;
        span {
          color: rgb(87, 86, 86);
          font-size: 12px;
        }
      }
    }
    .song_list {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-around;
      padding: 0 20px;
      height: 100px;
      overflow: hidden;
      background: $color-highlight-background;
      color: $color-text-d;
      font-size: $font-size-small;
    }
  }
}
</style>
