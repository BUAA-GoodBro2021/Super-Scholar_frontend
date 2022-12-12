<template>
  <div>
    <div class="search-history-title">
      <span>最近搜索</span>
      <svg
        aria-hidden="true"
        class="search-history-icon-delete"
        @click="onDeleteAllClick"
      >
        <use xlink:href="#icon-delete" fill="#a1a1aa"/>
      </svg>
    </div>

    <div class="search-history-container">
      <div 
        v-for="(item, index) in searchStore.historyList"
        :key="index"
        class="search-history-bubble"
        @click="onHistoryBubbleClick(item)"
      >
        <span class="search-history-context">{{item}}</span>
        <!--
          @IMPORTANT 
          这里的阻止冒泡非常关键，因为外层 div （v-for）也是靠点击触发
          外层div触发的是 搜索，删除图标触发的是 删除记录
         -->
        <svg
          aria-hidden="true"
          class="search-history-icon-delete"
          @click.stop="onDeleteClick(index)"
        >
          <use xlink:href="#icon-clear" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script>
  const EMIT_HISTORY_BUBBLE_CLICK = 'historyBubbleClick';
</script>

<script setup>
import { useSearchStore } from '../../stores/search.js';
// TODO 删除所有搜索历史的确认对话框
import { showConfirmDialog } from '../Dialog/index.js';

const emits = defineEmits([EMIT_HISTORY_BUBBLE_CLICK]);

const searchStore = useSearchStore();

/**
 * 删除所有记录
 */
const onDeleteAllClick = () => {
  showConfirmDialog('清空历史记录', '您要删除所有记录吗？')
  .then(() => {
    searchStore.deleteAllHistory();
  })
  .catch(() => {
    console.log('点击了取消');
  })
}

/**
 * 删除单条历史记录
 */
const onDeleteClick = (index) => {
  searchStore.deleteHistory(index);
}

/**
 * 点击历史记录气泡 发生事件
 * 这里的item依然仅仅是一个字符串
 */
const onHistoryBubbleClick = (item) => {
  emits(EMIT_HISTORY_BUBBLE_CLICK, item);
}
</script>

<style scoped>
.search-history-title {
  display: flex;
  align-items: center;
  font-size: 10px;
  line-height: 14px;
  color: rgb(161 161 170);
  margin-bottom: 10px;
}

.search-history-container {
  display: flex;
  flex-wrap: wrap;
}

.search-history-bubble {
  margin-right: 20px;
  margin-bottom: 15px;
  /* 两个值：上下 左右 */
  padding: 5px 15px;
  border-radius: 5px;

  display: flex;
  align-items: center;
  cursor: pointer;

  background-color: rgb(244 244 245);
  color: rgb(24 24 27);
  font-size: 14px;
  line-height: 18px;
  font-weight: 700;
  transition-duration: 300ms;

  
}
.search-history-bubble:hover {
  background-color: rgb(228 228 231);
}
.search-history-bubble .search-history-context {
  /* max-width: 90%; */
  /* FIXME 下面四行一起用可以实现多行溢出文本用省略号 "..." 代替，保证不超过一行 */
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
}

.search-history-icon-delete {
  width: 25px;
  height: 25px;
  margin-left: 10px;
  padding: 5px;
  border-radius: 5px;
  transition-duration: 300ms;
  cursor: pointer;
  box-sizing: border-box;
}
.search-history-icon-delete:hover {
  background-color: rgb(244 244 245);
}
</style>