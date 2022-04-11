<template>
  <div class="tab_wrap">
    <router-link
      class="tab_item"
      v-for="tab in tabList"
      :key="tab.path"
      :to="tab.path"
    >
      <span class="tab_link">
        {{ tab.title }}
      </span>
    </router-link>
  </div>
</template>

<script setup lang="ts">
const tabList = [
  { title: "推荐", id: 1, path: "/recommend" },
  { title: "歌手", id: 2, path: "/singer" },
  { title: "排行", id: 3, path: "/toplist" },
  { title: "搜索", id: 4, path: "/search" }
]
</script>

<style lang="scss" scoped>
.tab_wrap {
  display: flex;
  height: 44px;
  line-height: 44px;
  font-size: $font-size-medium;
  justify-content: space-around;
  .tab_item {
    .tab_link {
      padding-bottom: 5px;
      color: $color-text-l;
    }

    &.router-link-active {
      .tab_link {
        color: $color-theme;
        border-bottom: 2px solid $color-theme;
      }
    }
  }
}
</style>
