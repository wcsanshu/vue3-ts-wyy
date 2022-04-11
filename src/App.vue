<template>
  <HeaderView />
  <Tab />
  <div>
    <router-view></router-view>
  </div>
  <Player />
</template>

<script setup lang="ts">
import HeaderView from "./components/HeaderView/HeaderView.vue"
import Tab from "./components/Tab/Tab.vue"
import Player from "./components/Player/Player.vue"
</script>

<style lang="scss"></style>
