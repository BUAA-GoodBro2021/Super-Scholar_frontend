<template>
  <div class="slider-captcha-background" @click.self="onClose">
    <div class="slider-captcha-container">
      <div class="slider-captcha-header">
        <span class="slider-captcha-span">请完成安全验证</span>
        <svg 
          aria-hidden="true" 
          class="slider-captcha-icon-refresh" 
          @click="onReset"
        >
          <use xlink:href="#icon-refresh" />
        </svg>
        <svg 
          aria-hidden="true" 
          class="slider-captcha-icon-close" 
          @click="onClose"
        >
          <use xlink:href="#icon-close" />
        </svg>
      </div>
      <!-- captcha 挂载点 -->
      <div id="captcha"></div>
    </div>
  </div>
</template>

<script>
  const EMIT_CLOSE = 'close'
  const EMIT_SUCCESS = 'success'
/**
 * 这两个文件我进行了一些修改，和官方的是不一样的
 */
import '../../vendor/SliderCaptcha/slidercaptcha.min.css';
import '../../vendor/SliderCaptcha/longbow.slidercaptcha.min.js';
</script>

<script setup>

import { Account } from '../../api/account';
import { onMounted } from 'vue'

const emits = defineEmits([EMIT_CLOSE, EMIT_SUCCESS]);

let captcha = null;
onMounted(() => {
  // 创建 captcha 实例
  captcha = sliderCaptcha({
    // 渲染位置
    id: 'captcha',
    // 用户拼图成功之后的回调，arr为客户端拖动滑块的轨迹
    async onSuccess(arr) {
      // console.log(arr);
      const res = await Account.humanVerification({
        arr: arr,
      });
      console.log(res.data);
      // 后端返回的 res.data.flag 是一个布尔值
      // 这里后端还返回了一个 message字段，表示人机验证是否通过，但是感觉这里没必要触发消息组件
      if (res.data.flag) {
        emits(EMIT_SUCCESS);
      }
    },
    // 用户拼图失败之后的回调
    onFail() {
      console.log('onFail');
    },
    /**
     * 默认的验证方法，返回布尔值，但是我们不在这里验证
     * @param {*} arr 客户端拖动滑块的轨迹
     * @param {*} url 服务器端请求地址
     */
    verify(arr, url) {
      console.log('verify');
      return true;
    },
    /**
     * 图床图片加载失败时调用此方法返回本地图片路径
     */
    localImages() {
      return 'src/assets/captchaImgs/' 
      + Math.round(Math.random() * 6 + 1)
      + '.jpg';
    }
  });
});


/**
 * 重置
 */
const onReset = () => {
  captcha.reset();
}
/**
 * 关闭
 */
const onClose = () => {
  emits(EMIT_CLOSE);
}
</script>

<style scoped>
.slider-captcha-background{
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10000;
  background-color: rgba(255, 255, 255, 0.5);
}

.slider-captcha-container {
  
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  width: 340px;
  height: 270px;
  
  border: 1px solid rgb(228 228 231);
  border-radius: 10px;
  font-size: 14px !important;
  font-weight: bold;
  line-height: 18px;
  background-color: rgb(255, 255, 255);
}
.dark .slider-captcha-container {
  border-color: rgb(24 24 27);
  background-color: rgb(39 39 42);
}
.slider-captcha-header {
  display: flex;
  align-items: center;

  height: 50px;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 10px;

  text-align: left;
}
.slider-captcha-span {
  flex-grow: 1;
}
.dark .slider-captcha-span {
  color: rgb(228 228 231);
}
.slider-captcha-icon-refresh {
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition-duration: 200ms;
  /* svg 填充颜色 */
  fill: #18181b;
}
.slider-captcha-icon-refresh:hover{
  background-color: rgb(228 228 231);
}
.dark .slider-captcha-icon-refresh {
  background-color: rgb(24 24 27);
  /* svg 填充颜色 */
  fill: #e4e4e7;
}

.slider-captcha-icon-close {
  margin-left: 20px;
  width: 20px;
  height: 20px;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;
  transition-duration: 200ms;
  /* svg 填充颜色 */
  fill: #18181b;
}
.slider-captcha-icon-close:hover {
  background-color: rgb(228 228 231);
}
.dark .slider-captcha-icon-close {
  background-color: rgb(24 24 27);
  /* svg 填充颜色 */
  fill: #e4e4e7;
}
</style>