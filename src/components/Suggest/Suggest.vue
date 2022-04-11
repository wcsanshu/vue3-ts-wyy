<template>
  <!-- 搜索建议 -->
  <div v-loading="!serachResult.length" class="suggest_wrap">
    <!-- 建议列表 -->
    <ul class="suggest_list">
      <!-- item -->
      <li v-for="item in serachResult" :key="item.id" class="suggest_item">
        <div class="icon">
          <i class="icon-mine"></i>
        </div>
        <div class="name">
          <p class="text">{{ item.name }}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch, ref } from "vue"
import { getSearchAPI } from "@/apis"
export default defineComponent({
  name: "Suggest",
  props: {
    query: String
  },
  setup(props) {
    const serachResult = ref([])
    watch(
      () => props.query,
      async (newQuery) => {
        serachResult.value = []
        const result = await getSearchAPI(newQuery, 20, 0)
        console.log(result.data.result)
        const { songs } = result.data.result
        serachResult.value = songs || []
      }
    )
    return {
      serachResult
    }
  }
})
</script>

<style lang="scss">
.suggest_wrap {
  height: 100%;
  overflow: hidden;
  .suggest_list {
    padding: 0 20px;
    .suggest_item {
      display: flex;
      align-items: center;
      .icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>
