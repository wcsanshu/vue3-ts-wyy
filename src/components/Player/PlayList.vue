<template>
  <teleport to="body">
    <transition name="list-fade">
      <!-- 播放列表组件(弹出) -->
      <div
        v-show="show && playlist.length"
        @click="HandleClose"
        class="playlist_wrap"
      >
        <div class="playlist_inner" @click.stop>
          <!-- 顶部部分 -->
          <div class="top_inner">
            <!-- 播放图标 -->
            <i class="icon" :class="playModeIcon"></i>
            <!-- 播放状态文字 -->
            <span class="mode_text">{{ modeText }}</span>
            <!-- 清除全部 -->
            <span @click="clearSongs" class="clear">
              <i class="icon-clear"></i>
            </span>
          </div>

          <Scroll ref="scrollRef" class="list-content">
            <transition-group ref="listRef" name="list" tag="ul">
              <li
                class="item"
                v-for="item in playlist"
                :key="item.id"
                @click="selectItem(item)"
              >
                <!-- 播放图标 -->
                <i :class="CurrentPlayIcon(item)" class="current"> </i>

                <!-- 歌曲名称 -->
                <span class="text">{{ item.name }}</span>
                <!-- 收藏or取消收藏 -->
                <span class="favorite" @click="toggleFavorite(item)">
                  <i :class="getFavoriteIcon(item)"></i>
                </span>

                <!-- 删除歌曲图标 -->
                <span
                  @click.stop="handleRemoveSong(item)"
                  :class="{ disable: removing }"
                  class="delete"
                >
                  <i class="icon-delete"></i>
                </span>
              </li>
            </transition-group>
          </Scroll>

          <div class="bottom_inner">
            <div @click="HandleClose" class="list-footer">
              <span>关闭</span>
            </div>
          </div>
        </div>
        <Confirm
          ref="ConfirmRef"
          @confirm="onConfirm"
          @cancel="onCancel"
          text="是否清空播放列表"
          confirm="清空"
          cancel="取消"
        />
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from "vue"
import { useStore, useUserStoreWithOut } from "@/store/store"
import { storeToRefs } from "pinia"
import Scroll from "../Scroll/Scroll.vue"
import useMode from "./useMode"
import useFavorite from "./useFavorite"
import Confirm from "../confirm/confirm.vue"
import { Toast } from "vant"
export default defineComponent({
  name: "PlayList",
  components: { Scroll, Confirm },
  setup() {
    const { playModeIcon, modeText } = useMode()
    const { playlist, currentSong, sequenclList } = storeToRefs(
      useUserStoreWithOut()
    )
    const { setCurrentIndex, setPlayingState, removeSong, clearPlayList } =
      useStore()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const show = ref(false) // 控制播放列表显示or隐藏
    const scrollRef = ref<any>(null)
    const listRef = ref<any>(null)
    const removing = ref(false) // 控制点击频率 true代表执行中 false代表非执行中
    const ConfirmRef = ref<any>(null) // 消息提醒组件的ref
    // 播放后滚动到当前选中歌曲
    watch(currentSong, async (newSong) => {
      if (!show.value || !newSong.id) return
      await nextTick()
      scrollToCurrent()
    })

    // 显示播放列表
    const HandleShow = async () => {
      show.value = true
      await nextTick()
      // 重新计算滚动
      refreshScroll()
      // 跳转到当前播放项
      scrollToCurrent()
    }
    // 隐藏播放列表
    const HandleClose = () => {
      show.value = false
    }
    // 删除歌曲项item
    const handleRemoveSong = (song) => {
      if (removing.value) {
        return
      }
      removing.value = true
      removeSong(song)
      setTimeout(() => {
        removing.value = false
      }, 300)
      if (!playlist.value.length) {
        show.value = false
      }
    }

    // 播放歌曲
    const selectItem = (song) => {
      const playList: any = playlist.value
      const { id } = song
      console.log("ssss", song)
      const index = playList.findIndex((item) => item.id === id)
      setCurrentIndex(index)
      setPlayingState(true)
    }

    // 根据当前播放id 渲染播放图标
    function CurrentPlayIcon(song) {
      if (currentSong.value.id === song.id) {
        return "icon-play"
      }
    }

    // 打开播放列表跳转到当前播放项
    function scrollToCurrent() {
      const playList: any = playlist.value
      // 首先拿到当前播放项的id 去播放列表里面找,找到对应的index
      const index = playList.findIndex(
        (item) => item.id === currentSong.value.id
      )
      if (index === -1) return
      // listRef挂载到ul项上
      // listRef.value.children 为ul下的li 然后对应的index
      setTimeout(() => {
        console.log(listRef.value)
      }, 2000)

      const target = listRef.value.$el.children[index]
      // 执行跳转
      scrollRef.value.scroll.scrollToElement(target, 300)
    }

    // 重新计算
    function refreshScroll() {
      // 拿到scroll 的实例 执行内部的 refresh() 重新计算
      scrollRef.value.scroll.refresh()
    }

    // 监听消息组件派发的事件
    // 取消
    const onCancel = () => {
      console.log("执行取消")
    }

    // 监听确认事件
    const onConfirm = () => {
      // 执行pinia的清空操作
      clearPlayList()
      show.value = false
      Toast.success("清除成功")
    }

    // 显示消息提示组件
    const clearSongs = () => {
      ConfirmRef.value.show()
    }
    return {
      playModeIcon,
      handleRemoveSong,
      modeText,
      show,
      playlist,
      scrollRef,
      listRef,
      ConfirmRef,
      selectItem,
      getFavoriteIcon,
      toggleFavorite,
      CurrentPlayIcon,
      HandleShow,
      HandleClose,
      removing,
      onConfirm,
      onCancel,
      clearSongs
    }
  }
})
</script>

<style lang="scss">
.current_song {
  color: red;
}
.playlist_wrap {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active,
  &.list-fade-leave-active {
    transition: opacity 0.3s;
    .list-wrapper {
      transition: all 0.3s;
    }
  }
  &.list-fade-enter-from,
  &.list-fade-leave-to {
    opacity: 0;
    .list-wrapper {
      transform: translate3d(0, 100%, 0);
    }
  }
  .playlist_inner {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 210;
    width: 100%;
    background-color: $color-highlight-background;
    .top_inner {
      display: flex;
      align-items: center;

      .icon {
        margin-right: 10px;
        font-size: 24px;
        color: $color-theme-d;
      }
      .mode_text {
        margin-right: auto;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      padding: 20px 30px 10px 20px;
    }
  }
}
.clear {
  @include extend-click();
  .icon-clear {
    font-size: $font-size-medium;
    color: $color-text-d;
  }
}
.list-content {
  max-height: 240px;
  overflow: hidden;
  .item {
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 30px 0 20px;
    overflow: hidden;

    .current {
      flex: 0 0 20px;
      width: 20px;
      font-size: $font-size-small;
      color: $color-theme-d;
    }
    .text {
      flex: 1;
      @include no-wrap();
      font-size: $font-size-medium;
      color: $color-text-d;
    }
    .favorite {
      @include extend-click();
      margin-right: 15px;
      font-size: $font-size-small;
      color: $color-theme;
      .icon-favorite {
        color: $color-sub-theme;
      }
    }
    .delete {
      @include extend-click();
      font-size: $font-size-small;
      color: $color-theme;
      &.disable {
        color: $color-theme-d;
      }
    }
  }
}
.list-footer {
  text-align: center;
  line-height: 50px;
  background: $color-background;
  font-size: $font-size-medium-x;
  color: $color-text-l;
}
</style>
