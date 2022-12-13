<template>
  <div class="search-input-container">
    <!-- 子组件 SearchInputFrame 中定义了 search 事件和 clear 事件 -->
    <AdvSearchInputFrame
      v-model="inputSearchValue"
      @search="handleSearch"
      @clear="handleClear"
    >
      <!-- 下拉栏，命名组件的简写形式 <template v-slot:dropdown> -->
      <template #dropdown>
        <div>
          <!-- 搜索提示，点击某个搜索提示也会触发搜索 -->
          <Hint 
            v-show="inputSearchValue"
            :search-text="inputSearchValue"
            @hint-item-click="handleSearch"
          />
        </div>
      </template>
    </AdvSearchInputFrame>
  </div>
</template>

<script>
// 更新事件
const EMIT_UPDATE_MODELVALUE = 'update:modelValue'
// 输入事件
const EMIT_INPUT = "input";
</script>

<script setup>
import { ref } from 'vue';
import Hint from './Hint.vue';
import AdvSearchInputFrame from './AdvSearchInputFrame.vue';

const props = defineProps({
  modelValue: {
    type: String,
    required: true
  }
});
const emits = defineEmits([EMIT_UPDATE_MODELVALUE, EMIT_INPUT]);

/**
 * 搜索框内输入文本
 */
const inputSearchValue = useVModel(props);
// 监听输入行为
watch(inputSearchValue, (value) => {
  emits(EMIT_INPUT, value);
});

/**
 * 搜索回调
 * 在高级检索的搜索回调中，搜索栏仅仅是作为一个含有下拉提示的input框罢了
 * 不触发搜索，因此这里的仅仅是将双向绑定的文本更新
 */
const handleSearch = (val) => {
  // 去掉可能的斜体标签
  val = val.replace(/<\/?i>/ig, "");
  console.log("hint");
  console.log(val);
  inputSearchValue.value = val;
}
/**
 * 清空回调
 * 清除输入框搜索文本
 */
const handleClear = () => {
  console.log("Advance Input Clear");
  inputSearchValue.value = "";
}

</script>

<style scoped>
.search-input-container {
  width: 100%;
  box-sizing: border-box;
}
</style>