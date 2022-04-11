<template>
  <div class="search_wrap">
    <SearchInput v-model:value="query" />
    <div class="hot_wrap" v-show="!query">
      <span class="hot_title">热门搜索</span>
      <ul class="hot_inner">
        <li
          v-for="item in hotList"
          :key="item.id"
          @click="addQuery(item.first)"
          class="search_text"
        >
          <span>{{ item.first }}</span>
        </li>
      </ul>
    </div>
    <div class="suggest_wrap" v-show="query">
      <Suggest :query="query" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watch } from "vue"
import SearchInput from "@/components/SearchInput/SearchInput.vue"
import { getSearchHotAPI } from "@/apis"
import Suggest from "@/components/Suggest/Suggest.vue"
export default defineComponent({
  name: "Search",
  components: {
    SearchInput,
    Suggest
  },
  setup() {
    const query = ref("")
    const hotList = ref([])
    watch(query, (newValue) => {
      console.log(newValue.trim())
    })
    onMounted(async () => {
      const res = await getSearchHotAPI()
      const { hots } = res.data.result
      hotList.value = hots
      console.log(hots)
    })

    const addQuery = (item) => {
      query.value = item
    }

    return {
      query,
      hotList,
      addQuery
    }
  }
})
</script>

<style lang="scss">
.search_wrap {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  flex-direction: column;
}
.hot_wrap {
  display: flex;
  flex-direction: column;
  margin: 20px;
  .hot_title {
    margin-bottom: 15px;
    font-size: $font-size-medium;
    color: $color-text-l;
  }
  .hot_inner {
    width: 100%;
    .search_text {
      display: inline-block;
      padding: 5px 10px;
      margin: 0 20px 10px 0;
      border-radius: 6px;
      background: $color-highlight-background;
      font-size: $font-size-medium;
      color: $color-text-d;
    }
  }
}
.suggest_wrap {
  flex: 1;
  overflow: hidden;
}
</style>
