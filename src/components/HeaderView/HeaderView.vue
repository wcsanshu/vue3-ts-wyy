<template>
  <div class="header_warp">
    <span class="icon"></span>
    <span class="text">Chicken Music</span>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.header_warp {
  height: 44px;
  text-align: center;
  color: $color-theme;
  .icon {
    //与  inline 行内元素 相比，主要区别在于 inline-block 允许在元素上设置宽度和高度。
    display: inline-block;
    vertical-align: top;
    margin-top: 6px;
    width: 30px;
    height: 32px;
    margin-right: 9px;
    @include bg-image(
      "logo"
    ); // @include 指令可以将混入（mixin）引入到文档中,需要配置mixin.scss
    background-size: 30px 32px;
  }
  .text {
    display: inline-block;
    vertical-align: top;
    line-height: 44px;
    font-size: $font-size-large;
  }
}
</style>
