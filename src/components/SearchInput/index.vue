<template>
  <!-- guide-search 是功能引导 src\views\layout\components\floating\steps.js 中的一个步骤 -->
  <!-- <div class="w-full guide-search"> -->
  <div class="search-input-container">
    <!-- 子组件 SearchInputFrame 中定义了 search 事件和 clear 事件 -->
    <SearchInputFrame
      v-model="inputSearchValue"
      @search="handleSearch"
    >
      <!-- 下拉栏，命名组件的简写形式 <template v-slot:dropdown> -->
        <!-- 搜索提示，点击某个搜索提示也会触发搜索 -->
        <!-- 
          最近搜索，和搜索提示交替出现
          点击历史记录气泡默认触发搜索+将历史记录放到数组最开始
          点击搜索的叉号则会删除单条记录 
         -->
      <template #dropdown>
        <div>
          <!-- <Hint 
            v-show="inputSearchValue"
            :search-text="inputSearchValue"
            @hint-item-click="handleSearch"
          /> -->
          <History
            v-show="!inputSearchValue"
            @history-bubble-click="handleSearch"         
          />
        </div>
      </template>
    </SearchInputFrame>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useSearchStore } from '../../stores/search.js';
import Hint from './Hint.vue';
import History from './History.vue';
import SearchInputFrame from './SearchInputFrame.vue';

const inputSearchValue = ref("");
const searchStore = useSearchStore();
/**
 * 搜索回调
 * 在搜索回调中，必须更新 vuex/pinia 中的 searchInputText
 * 因为 searchInputText 不是一个孤零零的数据，对于搜索框内容在确定要进行搜索以后，
 * 相关的页面部分应该根据 searchText 做出反应
 * 这也是需要把 搜索框文本 存储在 vuex/pinia state的原因，当然，它需要持久化存储
 */
const handleSearch = (val) => {
  inputSearchValue.value = val;
  if( val ) {
    searchStore.addHistory(val);
    // 触发 searchText 的变化
    searchStore.setSearchInputText(val);
  };
}

</script>

<style scoped>
.search-input-container {
  width: 100%;
  box-sizing: border-box;
}
</style>