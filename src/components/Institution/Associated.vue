<template>
  <div class="assiciated-wrap">
    <div class="assiciated-title">相关机构</div>
    <div class="institution-list" v-if="institutionList.length > 0">
      <div
        class="institution-card"
        v-for="(item, index) in institutionList"
        :key="index"
        @click="toInstitution(item)" 
      >
        <div class="associate-left"></div>
        <ul class="list-item">
          <li class="associated-name-li">
            <span class="associated-name" :title="item.display_name">
              {{ item.display_name }}
            </span>
          </li>
          <li class="right-arrow-li">
            <span class="right-arrow-wrap">
              <el-icon>
                <Right />
              </el-icon>
            </span>
          </li>
        </ul>
      </div>
    </div>
    <div v-else class="empty">没有相关机构</div>
    <div class="associated-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="institutionTotalSize"
        @current-change="changePage()"
        v-model:current-page="pageCurrent"
        hide-on-single-page
        :page-size="5"
      />
    </div>
  </div>
</template>

<script setup>
import { Right } from "@element-plus/icons-vue";
import { useRouter } from "vue-router";
const router = useRouter();
const emit = defineEmits(["associatedInstitutionPageChange"]);
const pageCurrent = ref(1);
const props = defineProps({
  institutionList: Array,
  institutionTotalSize: Number,
});

const changePage = () => {
  emit("associatedInstitutionPageChange", pageCurrent.value);
};

const toInstitution = (item) => {
  let { href } = router.resolve({
    name: "InstitutionDetail",
    params: { institutionid: item.id.slice(21) },
  });
  window.open(href, "_blank");
};
</script>
<style scoped>
.assiciated-wrap {
  width: 100%;
  background-color: white;
  box-shadow: 3px 3px 3px 3px #dedede;
  padding-top: 10px;

  display: flex;
  flex-direction: column;
  align-items: center;
  position: sticky;
  top: 70px;
}

.assiciated-title {
  font-size: 18px;
  font-weight: 800;
  text-align: left;
  width: 90%;
  height: 40px;
  line-height: 40px;
}

.institution-list {
  width: 90%;
  height: calc(100% - 76px);
  overflow-y: auto;
}

.associated-pagination {
  margin-top: 5%;
  bottom: 0;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 36px;
}

::-webkit-scrollbar {
  width: 0 !important;
}

::-webkit-scrollbar {
  width: 0 !important;
  height: 0;
}

.institution-card {
  width: 100%;
  height: 70px;
  margin: 20px 0px;
  position: relative;
  padding: 17px 0 7px 20px;
  box-shadow: 3px 3px 0px 0px #dedede;
  background-color: #f0f0f0;
  cursor: pointer;
}

.institution-card:hover {
  background-color: #f1f5fa;
}

.institution-card ul {
  margin: 0;
  height: 90%;
  width: 100%;
}

.institution-card ul:hover {
  background-color: #f1f5fa;
  border-radius: 10px;
}

.institution-card li {
  list-style: none;
  margin-right: 20px;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.institution-card .associated-name-li {
  width: 78%;
}

.institution-card .associated-name {
  font-size: 18px;
  font-weight: 800;
  font-family: "Times New Roman", Times, "Microsoft YaHei", serif;
  text-align: left;
  display: flex;
  align-items: center;
  height: 80%;
  width: 100%;
}

.associate-left {
  position: absolute;
  width: 7px;
  height: 30px;
  left: 0;
  top: 20px;
  background-color: black;
}

.list-item {
  cursor: pointer;
}

.right-arrow-li {
  line-height: 100%;
  float: right;
  margin-right: 10px;
  font-size: 30px;
  font-weight: 800;
}

.right-arrow-wrap {
  height: 80%;
  line-height: 100%;
  display: flex;
  align-items: center;
}

.canClick {
  cursor: pointer;
}

.empty {
    margin-top: 10px;
    color: grey;
    font-size: 18px;
    font-weight: 600;
}
</style>
