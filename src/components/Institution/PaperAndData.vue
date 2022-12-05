<template>
  <div class="paper_common_layout">
    <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
      <el-tab-pane label="发表文献" name="paper" class="tab-pane">
        <PaperList
          :paper-list="paperList"
          :page-total-size="pageTotalSize"
          @change-page="changePage"
        />
      </el-tab-pane>
      <el-tab-pane label="数据分析" name="data" class="tab-pane">
        <Data :data-count-by-year="dataCountByYear" :tabChange="tabAtData" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { defineEmits } from "vue";
import PaperList from "./PaperList.vue";
import Data from "./Data.vue";
const emit = defineEmits(["changePage"]);
const activeName = ref("paper");
const tabAtData = ref(false);

const props = defineProps({
  institutionInfo: Object,
  paperList: Object, //文献列表
  dataCountByYear: Object, //数据分析
  pageTotalSize: Number, //文献总条数
});

const handleClick = (tab) => {
  if (tab.paneName == "data") tabAtData.value = true;
  else tabAtData.value = false;
};

const changePage = (page) => {
  console.log("PaperAndData.vue: " + page);
  emit("changePage", page);
};
</script>

<style scoped>
.paper_common_layout {
  width: 100%;
  background-color: white;
  border-radius: 20px;
  box-shadow: 3px 3px 3px 3px #dedede;
  /* height: 100%; */

  display: flex;
  justify-content: center;
  align-items: center;
}

.demo-tabs {
  width: 90%;
  height: 90%;
  margin-top: 30px;
  margin-bottom: 5%;
}

:deep(.demo-tabs .el-tabs__item) {
  font-size: 18px;
  font-weight: 800;
}

:deep(.demo-tabs .el-tabs__content) {
  width: 100%;
  height: 96%;
}

:deep(.demo-tabs .el-tab-pane) {
  height: 100%;
  width: 100%;
}

.empty {
  margin-top: 10px;
  color: grey;
  font-size: 18px;
  font-weight: 600;
}
</style>
