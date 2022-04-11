<template>
  <teleport to="body">
    <transition v-show="isShow" name="confirm-fade">
      <div class="confirm">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <p class="text">{{ text }}</p>
            <div class="operate">
              <!-- 确定按钮 -->
              <div @click="Handleconfirm" class="operate-btn left">
                {{ confirm }}
              </div>
              <!-- 取消按钮 -->
              <div @click="Handlecancel" class="operate-btn">{{ cancel }}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue"

export default defineComponent({
  name: "confirm",
  props: {
    text: {
      type: String,
      default: ""
    },
    confirm: {
      type: String,
      default: "确定"
    },
    cancel: {
      type: String,
      default: "取消"
    }
  },
  // 派发两个事件 确定 和取消
  emits: ["confirm", "cancel"],
  setup(props, { emit }) {
    const isShow = ref(false)

    // 确认按钮
    const Handleconfirm = () => {
      hide()
      emit("confirm")
    }

    // 取消按钮
    const Handlecancel = () => {
      hide()
      emit("cancel")
    }

    // 隐藏提示框
    const hide = () => {
      isShow.value = false
    }
    // 显示提示框
    const show = () => {
      isShow.value = true
    }
    return {
      isShow,
      show,
      hide,
      Handleconfirm,
      Handlecancel
    }
  }
})
</script>

<style lang="scss">
.confirm {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 998;
  background-color: $color-background-d;
  &.confirm-fade-enter-active {
    animation: confirm-fadein 0.3s;
    .confirm-content {
      animation: confirm-zoom-in 0.3s;
    }
  }
  &.confirm-fade-leave-active {
    animation: confirm-fadeout 0.3s;
    .confirm-content {
      animation: confirm-zoom-out 0.3s;
    }
  }
  .confirm-wrapper {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
    .confirm-content {
      width: 270px;
      border-radius: 13px;
      background: $color-highlight-background;
      .text {
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text-l;
      }
      .operate {
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        .operate-btn {
          flex: 1;
          line-height: 22px;
          padding: 10px 0;
          border-top: 1px solid $color-background-d;
          color: $color-text-l;
          &.left {
            border-right: 1px solid $color-background-d;
            color: $color-text;
          }
        }
      }
    }
  }
}

@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

@keyframes confirm-zoom-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes confirm-zoom-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
