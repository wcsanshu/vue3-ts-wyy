<template>
  <div class="search-input">
    <i class="icon-search">
      <input
        class="input-inner"
        type="text"
        :value="value"
        @input="handleChange"
        :placeholder="placeholder"
      />
    </i>

    <i v-show="value" @click="clear" class="icon-dismiss"> </i>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, watch } from "vue"
import { debounce } from "throttle-debounce"
export default defineComponent({
  name: "SearchInput",
  props: {
    value: String,
    placeholder: {
      type: String,
      default: "搜索歌曲 歌手"
    }
  },
  setup(props, { emit }) {
    // const { value } = toRefs(props)
    const handleChange = (e) => {
      const debounceFunc = debounce(500, () => {
        emit("update:value", e.target.value)
      })
      debounceFunc()
    }

    // watch(value, () => {
    //   console.log("变化了")
    // })

    const clear = () => {
      emit("update:value", "")
    }
    return {
      handleChange,
      clear
    }
  }
})
</script>

<style lang="scss">
.search-input {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 95%;
  margin: 0 auto;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    display: flex;
    align-items: center;
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    border: none;
    flex: 1;
    margin: 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
</style>
