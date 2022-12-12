<template>
  <div>
    <!-- 蒙版 -->
    <transition name="fade">
      <div
        v-if="isVisible"
        class="dialog-container"
        @click="onClose"
      ></div>
    </transition>
    <!-- 浮窗 -->
    <transition name="up">
      <div
        v-if="isVisible"
        class="dialog-window"
        @click="onClose"
      >
        <!-- 标题 -->
        <div class="dialog-title">
          {{ title }}
        </div>
        <!-- 文本 -->
        <div class="dialog-content">
          {{ content }}
        </div>
        <!-- 按钮 -->
        <div class="dialog-btn-wrapper">
          <button class="dialog-cancel-btn" @click="onCancel" style="margin-right: 8px;">
            {{ cancelText }}
            <span></span>
          </button>
          <button class="dialog-confirm-btn" @click="onConfirm" style="margin-right: 8px;">
            {{ confirmText }}
            <span></span>
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue';

const props = defineProps({
  // 标题
  title: {
    type: String,
    required: true
  },
  // 描述
  content: {
    type: String,
    required: true
  },
  // 取消按钮文字
  cancelText: {
    type: String,
    default: '取消'
  },
  // 确定按钮文本
  confirmText: {
    type: String,
    default: '确定'
  },
  // 取消按钮事件
  cancelHandler: {
    type: Function,
  },
  // 确定按钮事件
  confirmHandler: {
    type: Function,
  },
  // 关闭窗口的回调
  closeHandler: {
    type: Function,
  }
});
/**
 * 控制浮窗显示
 */
const isVisible = ref(false);
const onShow = () => {
  isVisible.value = true;
}

/**
 * 处理动画
 * (render 函数的渲染会直接进行，出不来 transition 动画，
 *  所以需要在 onMounted 才把 isVisible.value 改为 true )
 */
onMounted(()=>{
  onShow();
});

/**
 * @IMPORTANT 关闭动画的执行事件
 * 这里是 vue3 的语法糖：
 * 将css的值关联到动态的组件状态上绑定到 css 里面
 * https://cn.vuejs.org/api/sfc-css-features.html#v-bind-in-css
 * 所以我们这里把 closeDuration 绑定到了动画里
 */
const closeDuration = '0.5s';

/**
 * 确认事件，无论是否传入了额外的逻辑，都会关闭对话框
 */
const onConfirm = () => {
  if (props.confirmHandler) {
    props.confirmHandler();
  }
  onClose();
}
/**
 * 取消事件，无论是否传入了额外的逻辑，都会关闭对话框
 */
const onCancel = () => {
  if (props.cancelHandler) {
    props.cancelHandler();
  }
  onClose();
}
/**
 * 关闭事件
 */
const onClose = () => {
  isVisible.value = false;
  // 延时关闭处理，等待动画完全关闭之后，才能触发 props.closeHandler()
  setTimeout(() => {
    if (props.closeHandler) {
      props.closeHandler();
    }
  }, parseInt(closeDuration.replace('0.', '').replace('s', '')) * 100);
}

</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active{
  transition: all v-bind(closeDuration);
}
// 准备进入，离开完成
.fade-enter-from,
.fade-leave-to{
  opacity: 0;
}

.up-enter-active,
.up-leave-active{
  transition: all v-bind(closeDuration);
}

// 准备进入，离开完成
.up-enter-from,
.up-leave-to{
  opacity: 0;
  transform: translate3d(-50%, 100px, 0);
}

.dialog-container {
  width: 100vw;
  height: 100vh;
  // background-color: rgb(24 24 27 / 0.8);
  background-color: rgb(255 255 255 / 0.6);
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
}
.dialog-window {
  width: 80%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10000;
  padding: 6px 8px;
  border-radius: 2px;
  border: 4px solid black;
  cursor: pointer;
  background-color: white;
  @media (min-width: 1280px) {
    width: 35%;
  }
}
.dark.dialog-window {
  background-color: rgb(39 39 42);
  border-color: rgb(82 82 91);
}

.dialog-title {
  font-size: 22px;
  line-height: 26px;
  font-weight: 700;
  margin-bottom: 20px;
}
.dark.dialog-title {
  color: rgb(228 228 231);
}

.dialog-content {
  font-size: 16.8px;
  line-height: 20.8px;
  color: rgb(24 24 27);
  margin-bottom: 20px;
  font-weight: 500;
}
.dark.dialog-content {
  color: rgb(228 228 231);
}

.dialog-btn-wrapper {
  display: flex;
  justify-content: flex-end;
}

.dialog-confirm-btn {
  border: none;
  display: inline-block;
  position: relative;
  z-index: 0;
  padding: 8px 35.2px;
  height: 38px;
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  user-select: none;
  color: black;
  overflow: hidden;
}
.dialog-confirm-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid black;
}
.dialog-confirm-btn span::before {
  content: "";
  position: absolute;
  width: 8%;
  height: 500%;
  background: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-60deg);
  transition: all 0.3s;
}
.dialog-confirm-btn:hover span::before,
.dialog-confirm-btn:focus span::before {
  transform: translate(-50%, -50%) rotate(-90deg);
  width: 100%;
  background: black;
}
.dialog-confirm-btn:hover, 
.dialog-confirm-btn:focus {
  color: white;
}

.dialog-cancel-btn {
  border: none;
  display: inline-block;
  position: relative;
  z-index: 0;
  padding: 8px 35.2px;
  height: 38px;
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  user-select: none;
  color: white;
  overflow: hidden;
}
.dialog-cancel-btn span {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: -1;
  border: 4px solid black;
}
.dialog-cancel-btn span::before {
  content: "";
  position: absolute;
  width: 100%;
  height: 500%;
  background: black;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(-90deg);
  transition: all 0.3s;
}
.dialog-cancel-btn:hover span::before,
.dialog-cancel-btn:focus span::before {
  transform: translate(-50%, -50%) rotate(-60deg);
  width: 8%;
  background: white;
}
.dialog-cancel-btn:hover, 
.dialog-cancel-btn:focus {
  color: black;
}
</style>