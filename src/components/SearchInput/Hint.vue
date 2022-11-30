<template>
  <div>
    <!-- v-html 填充标签内部 DOM -->
    <div 
      v-for="(item, index) in hintData"
      :key="index"
      class="hint-text-container"
      @click="onHintItemClick(item)"
      v-html="highlightText(item)"
    ></div>
  </div>
</template>

<script>
  const EMIT_HINT_ITEM_CLICK = 'hintItemClick';
</script>

<script setup>
import { ref } from 'vue';
import { watchDebounced } from '@vueuse/core';
// TODO 这里要更改请求
// import { getSearchHint } from '@/api/img';

const props = defineProps({
  // 搜索文本
  searchText: {
    type: String,
    required: true
  },
});
const emits = defineEmits([EMIT_HINT_ITEM_CLICK]);

/**
 * 梳理搜索提示数据获取
 */
const hintData = ref([]);
const getHintData = async () => {
  if (!props.searchText) return;
  const { result } = await getSearchHint({
    q: props.searchText,
  });
  hintData.value = result;
}

/**
 * @IMPORTANT
 * watch可以监听一个 ref 响应式数据，或者一个包含 getter 的函数
 * 这里使用 vueuse 的 watchDebounced 进行防抖处理，避免了 输入内容一改变 就触发请求
 */
watchDebounced(
  () => props.searchText,
  getHintData,
  { 
    immediate: true,
    // 在 300 ms 内同一事件触发，不触发新的请求
    debounce : 300
  }  
);

/**
 * 处理关键字高亮
 */
const highlightText = (text) => {
  // 生成高亮标签
  const highlightStr = `<span class="text-zinc-900 dark:text-zinc-200">${props.searchText}</span>`
  // 构建正则表达式
  const regModelStr = escapeRegExp(props.searchText);
  const reg = new RegExp(regModelStr, 'gi');
  // const reg = new RegExp(props.searchText, 'gi');
  // 从《显示文本中》找出与《用户输入文本相同的内容》，使用《高亮标签》进行替换
  return text.replace(reg, highlightStr);
}
/**
 * @VERY_IMPORTANT 处理用户输入，修复bug
 * 把目标字符串中的特殊符号（主要是在正则表达式中有特殊涵义的符号）替换掉，然后再创建正则表达式，
 * 从而避免用 props.searchText 直接匹配 可能会使得正则字符串非法
 * （如用户输入单个?, 就会形成/?/，这个正则模板字符串显然是非法的）
 * 函数 escapeRegExp() 是 MDN 官方建议
 * https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions#%E4%BE%8B%E5%AD%90
 * 另外这里 $& 表示整个被匹配的字符串，详情可见知乎的一个回答
 * https://www.zhihu.com/question/519758290/answer/2372262972
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 点击 某一项输入提示 item 的事件处理
 * 注意，这里的item就是一个字符串
 */
const onHintItemClick = (item) => {
  emits(EMIT_HINT_ITEM_CLICK, item);
}
</script>

<style scoped>
.hint-text-container {
  padding: 0.25rem/* 4px */;
  padding-right: 0;

  font-size: 0.42rem/* 6.72px */;
  line-height: 0.52rem/* 8.32px */;
  font-weight: 700;
  color: rgb(113 113 122);

  border-radius: 0.25rem;
  cursor: pointer;
  transition-duration: 300ms;
}
.hint-text-container:hover {
  background-color: rgb(228 228 231);
}
.dark .hint-text-container:hover {
  background-color: rgb(24 24 27);
}
</style>