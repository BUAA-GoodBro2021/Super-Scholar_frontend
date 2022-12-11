<template>
  <div class="paper-list-wrap">
    <ul class="search-result__list">
      <div class="hint" v-if="pageTotalSize > 10000">
        *由于结果数量超过10,000，出于实用性考虑，列表只会展示相关度排序的前10,000条
      </div>
      <div class="pagination-wrap">
        <el-pagination
          layout="prev, pager, next"
          :total="pageTotalSize <= 10000 ? pageTotalSize : 10000"
          @current-change="changePage"
          v-model:current-page="pageCurrent"
          hide-on-single-page
          :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
        />
      </div>
      <!-- 单个搜索结果卡片 -->
      <li class="result-item" v-for="(item, index) in paperList">
        <WorksResCard :item="item" />
      </li>
    </ul>

    <div class="pagination-wrap">
      <el-pagination
        layout="prev, pager, next"
        :total="pageTotalSize <= 10000 ? pageTotalSize : 10000"
        @current-change="changePage"
        v-model:current-page="pageCurrent"
        hide-on-single-page
        :page-sizes="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]"
      />
    </div>
  </div>
</template>

<script setup>
import WorksResCard from "../../views/search/WorksResCard.vue";
const emit = defineEmits(["changePage"]);
const pageCurrent = ref(1);
const props = defineProps({
  paperList: Object,
  pageTotalSize: Number,
});

const changePage = () => {
  emit("changePage", pageCurrent.value);
};
</script>

<style scoped>
.paper-list-wrap {
  width: 100%;
  position: relative;
}

.pagination-wrap {
  margin-top: 5%;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 36px;
}

.search-result__list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.search-result__list .result-item {
  width: 100%;
  display: inline-block;
  font-size: 0.875rem;
}

.hint {
  margin: 20px;
  font-style: italic;
}
</style>
