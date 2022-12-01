<!-- 
  @author Cloud-Iris
  搜索框的骨架，可以根据插槽完成自定义搜索框
 -->
<template>
  <div 
    ref="searchContainerTarget"
    class="group search-container"
  >
    <div>
      <!-- 
        搜索模式切换
       -->
      <select 
        ref="selectTarget"
        @change="handleSelectSearchType"
        class="group search-type-select"
      >
        <option value="works">论文</option>
        <option value="authors">作者</option>
        <option value="venues">期刊会议</option>
        <option value="institutions">机构</option>
        <option value="concepts">领域</option>
      </select>
      <!-- TODO: 可以来个左侧分割线，但不太必要 -->
      <!-- <div
        class="group search-divider-left"
      ></div> -->
      <!-- 
        输入框（回车/点击按钮触发搜索）
        取消了 maxlength="20"，改用padding掩盖
       -->
      <input class="group search-input"
        type="text" 
        placeholder="搜索"
        v-model="inputSearchValue"
        @focus="onFocusHandler"
        @blur="onBlurHandler"
        @keyup.enter="onSearchHandler"
      />
      <!-- 
        删除按钮，垂直居中，右偏移为 90px
        这里使得 inputSearchValue 不为 null 或者 '' 的时候才显示
      -->
      <svg 
        v-show="inputSearchValue"
        aria-hidden="true" 
        class="clear-text-icon"
        @click="onClearClick"
      >
        <use xlink:href="#icon-input-delete" />
      </svg>
      <!-- 分割线 -->
      <div
        class="group search-divider"
      ></div>
      <!-- 搜索按钮，点击按钮触发搜索 -->
      <!-- 搜索图标，垂直居中，右偏移为 20px -->
      <button
        class="search-btn"
      >
        <svg aria-hidden="true" class="search-btn-icon">
          <use xlink:href="#icon-search" fill="#707070" />
        </svg>
      </button>
      <!-- <svg aria-hidden="true" class="search-icon">
        <use xlink:href="#icon-search" fill="#707070" />
      </svg> -->
      <!-- <m-button 
        class="search-btn"
        icon="search" 
        iconColor="#ffffff"
        @click="onSearchHandler"
      ></m-button> -->
    </div>
    <!-- 
      搜索框下拉栏
      在开发者指定了 命名插槽name=dropdown以后 才会存在（$slot.dropdown不为空）
      在存在的基础上，当输入框获取到焦点的时候才会展示下拉栏
      也就是说，二者缺一不可。
      这里的 $slot.dropdown 指的就是 我们下面的命名插槽 <slot name="dropdown"/>
     -->
    <transition name="slide">
      <div
        v-if="$slots.dropdown"
        v-show="isFouced"
        class="search-dropdown search-scrollbar"
      >
      <!-- scrollbar- 开头的是滚动条样式，要装插件 tailwind-scrollbar 详见tailwind.config.cjs -->
        <slot name="dropdown"/>
      </div>
    </transition>
  </div>
</template>


<script>
// 用常量定义，使得不至于多次输入事件时错误
// 更新事件
const EMIT_UPDATE_MODELVALUE = 'update:modelValue'
// 触发搜索（点击或回车）事件
const EMIT_SEARCH = 'search'
// 删除所有文本事件
const EMIT_CLEAR = 'clear'
// 输入事件
const EMIT_INPUT = 'input'
// 获取焦点事件
const EMIT_FOCUS = 'focus'
// 失去焦点事件
const EMIT_BLUR = 'blur'
</script>

<script setup>
import { onMounted, ref, watch } from 'vue';
import { useVModel, onClickOutside } from '@vueuse/core';
import { useSearchStore } from '../../stores/search.js';

const selectTarget = ref(null);
const searchStore = useSearchStore();
onMounted(()=>{
  console.log(selectTarget.value);
  console.log(selectTarget.value.options);
})
const handleSelectSearchType = () => {
  // console.log(selectTarget.value);
  // console.log(selectTarget.value.options);
  // console.log(selectTarget.value.options[selectTarget.value.options.selectedIndex].value);
  const options = selectTarget.value.options;
  console.log(options[options.selectedIndex].value);
  searchStore.setSearchType(
    options[options.selectedIndex].value
  );
}
// selectTarget.value.options[selectTarget.value.selectIndex].value;

/**
 * 1.输入内容双向绑定、控制下拉区域的展示、事件处理
 * 2.hover样式 (搜索按钮在 hover 时显示)
 * 3.一键删除输入内容
 * 4.历史搜索
 * 5.输入匹配（即在后端数据库的支持下，在输入一半时显示提示，和百度差不多）
 * 6.个性推荐（推荐卡片）
 */
const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
})
const emits = defineEmits([
  EMIT_UPDATE_MODELVALUE,
  EMIT_CLEAR,
  EMIT_INPUT,
  EMIT_FOCUS,
  EMIT_BLUR,
  EMIT_SEARCH
])

/**
 * 搜索框内输入文本
 */
const inputSearchValue = useVModel(props);
// 监听输入行为
watch(inputSearchValue, (value) => {
  emits(EMIT_INPUT, value);
});
/**
 * 这里的逻辑是：
 * 父组件中使用子组件时，使用 v-model 进行绑定，
 * vue3这里props传入 modelValue。
 * 使用 vueuse 的 useVModel 把 modelValue 切换成响应式的对象 inputSearchValue
 * 然后把 inputSearchValue 双向绑定给 子组件中的 input 框，
 * 再用 watch 监视 inputSearchValue 的值，一旦发生变化，就触发 update:value 事件
 * 将变化后的值传递给父组件
 * 
 * 不使用 vueuse 的 useVModel的写法是；
 * const inputValue = ref(props.modelValue);  （因为 props 的值不是响应式的）
 * watch( inputValue, (value) => {
 *    emits('update:value', value)
 * });
 * 上面的 v-model='inputSearchValue'
 * 改为 v-model='inputValue'
 */

/**
 * 清空输入框文本
 */
const onClearClick = () => {
  inputSearchValue.value = '';
  emits(EMIT_CLEAR, '');
};

/**
 * 触发搜索
 */
const onSearchHandler = () => {
  emits(EMIT_SEARCH, inputSearchValue.value);
};

/**
 * 监听焦点行为
 */
const isFouced = ref(false);
const onFocusHandler = () => {
  isFouced.value = true;
  emits(EMIT_FOCUS);
};

/**
 * 失去焦点行为
 */
const onBlurHandler = () => {
  emits(EMIT_BLUR);
};

/**
 * 利用vueuse  onClickOutside() 实现
 *  点击指定区域外，隐藏 dropdown 下拉栏
 * 利用在对应的 H5 标签上写和下面变量同名的 ref 获得 DOM 元素
 */
const searchContainerTarget = ref(null);
onClickOutside(searchContainerTarget, () => {
  isFouced.value = false;
});

</script>

<style scoped>
.search-container {
  position: relative;
  padding: 5px;
  border-radius: 30px;
  border-color: rgb(255 255 255);
  transition-duration: 500ms;
}
.search-container:hover {
  background-color: rgb(254 226 226 / 0.4);
}
.dark .search-container {
  border-color: rgb(228 228 231);
}

.search-type-select {
  position: absolute; 
  top: 50%; 
  left: 14px; 
  transform: translate(0, -50%);
  width: 5rem;
  height: 60%; 
  outline: none;
  border: none;
  border-radius: 16px 0 0 16px;
  font-size: 14px;
  line-height: 18px;
  background-color: rgb(244 244 245);
  transition-duration: 500ms;
}
.group:hover .search-type-select {
  background-color: white;
}

/* caret-color : 改变输入框光标颜色，同时又不改变输入框里面的内容的颜色
  https://blog.csdn.net/u014490083/article/details/82469126  */
input {
  margin: 0;
  padding: 0;
}
/* border-style: solid; 解决input框默认3D效果使得左上边框和右下边框颜色不一样
  https://blog.csdn.net/gegegegege12/article/details/120684454 */
.search-input {
  display: block;
  width: 100%;
  height: 44px;
  /* padding-left: 40px; */
  padding-left: 100px;
  padding-right: 100px;
  
  font-size: 14px;
  line-height: 18px;
  font-weight: 600;
  color: rgb(24 24 27);
  letter-spacing: 1px;
  
  outline: 0;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(244 244 245);
  border-radius: 30px;
  box-sizing: border-box;

  background-color: rgb(244 244 245);
  caret-color: #a1a1aa;

  transition-duration: 500ms;
}
.search-input:focus {
  border-color: rgb(252 165 165);
}
.group:hover .search-input {
  background-color: white;
  border-color: rgb(228 228 231);
}
.dark .search-input {
  background-color: rgb(39 39 42);
  color: rgb(228 228 231);
  border-color: rgb(63 63 70);
}
.dark .group:hover .search-input {
  background-color: rgb(24 24 27);
  border-color: rgb(63 63 70);
}

.clear-text-icon{
  width: 15px;
  height: 15px;
  position: absolute;
  top: 50%;
  right: 90px;
  transform: translate(0, -50%);
  transition-duration: 500ms;
  cursor: pointer;
}

.search-divider {
  opacity: 0;
  width: 1px;
  height: 15px;
  background-color: rgb(228 228 231);

  position: absolute;
  top: 50%;
  right: 62px;
  transform: translate(0, -50%);

  transition-duration: 500ms;
}
.group:hover .search-divider {
  opacity: 1;
}

.search-icon {
  width: 15px;
  height: 15px;
  position: absolute;
  top: 50%;
  /* left: 20px; */
  right: 20px;
  transform: translate(0, -50%);
}


/* #region 搜索按钮和搜索按钮的图标 */
.search-btn {
  width: 40px;
  height: 40px;
  cursor: pointer;
  margin: 0;
  padding: 0;
  border: 0;
  box-sizing: border-box;
  background-color: rgb(244 244 245);

  position: absolute;
  top: 50%;
  right: 10px;
  border-radius: 0 9999px 9999px 0;
  transform: translate(0, -50%);
  /* opacity: 0; */
  transition-duration: 500ms;

  font-size: 14px;
  line-height: 18px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
}
.group:hover .search-btn {
  background-color: white;
}
.search-btn-icon {
  margin: auto;
  width: 15px;
  height: 15px;
  transition: 150ms;
}
.search-btn:hover .search-btn-icon {
  transform: scale(1.2, 1.2);
}
/* #endregion 搜索按钮和搜索按钮的图标结束 */

.search-dropdown {
  width: 100%;
  max-height: 368px;
  padding: 20px;
  overflow: auto;
  background-color: white;
  border-width: 1px;
  border-color: rgb(228 228 231);
  border-radius: 10px;

  position: absolute;
  left: 0px;
  top: 56px;
  z-index: 2000;

  transition-duration: 200ms;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  /* --tw-shadow: 0 0 #0000; */
}

.search-dropdown:hover {
  /* boxShadow 属性把一个或多个下拉阴影添加到框上。该属性是一个用逗号分隔阴影的列表 */
  box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgb(0 0 0 / 0.25);
}
.dark .search-dropdown {
  background-color: rgb(39 39 42);
  border-color: rgb(82 82 91);
}
.dark .search-dropdown:hover {
  box-shadow: 0 0 white, 0 0 white, 0 25px 50px -12px rgb(255 255 255 / 0.25);
}

.search-scrollbar {
  /* overflow: overlay; */
  scrollbar-width: thin;  /* 兼容火狐 */
}
/* ::-webkit-scrollbar 滚动条整体部分，可以设置宽度之类的 */
.search-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
/* ::-webkit-scrollbar-corner 边角 */
.search-scrollbar::-webkit-scrollbar-corner {
  background-color: initial;
}
/* ::-webkit-scrollbar-thumb 滚动条里面可以拖动的那个 */
.search-scrollbar::-webkit-scrollbar-thumb {
  background-color: transparent !important;
  border-radius: 10px;
}
/* ::-webkit-scrollbar-track 外层轨道 */
.search-scrollbar::-webkit-scrollbar-track {
  background-color: transparent !important;
}
@media (min-width: 1280px) {
  .search-scrollbar::-webkit-scrollbar-thumb {
    background-color: #e4e4e7 !important;
  }
  .dark .search-scrollbar::-webkit-scrollbar-thumb {
    background-color: #18181b !important;
  }
}

.slide-enter-active,
.slide-leave-active{
  transition: all .5s;
}
.slide-enter-from,
.slide-leave-to{
  opacity: 0;
  transform: translateY(40px);
}
</style>