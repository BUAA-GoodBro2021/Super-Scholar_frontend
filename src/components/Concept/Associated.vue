<template>
  <div class="assiciated-wrap">
    <div class="assiciated-title">相关机构</div>
    <div class="institution-list">
      <div
        class="institution-card"
        v-for="(item, index) in institutionList"
        :key="index"
      >
        <ul class="list-item">
          <!-- <li>
            <el-avatar
              :size="70"
              :src="item.image_url"
              style="cursor: pointer"
              @click="toInstitution(item)"
            ></el-avatar>
          </li> -->
          <li class="associated-name-li">
            <span
              class="associated-name"
              @click="toInstitution(item)"
              :title="item.display_name"
            >
              {{ item.display_name }}
            </span>
          </li>
          <li class="right-arrow-li">
            <span class="right-arrow-wrap">
              <el-icon style="cursor: pointer" @click="toInstitution(item)">
                <Right />
              </el-icon>
            </span>
          </li>
        </ul>
        <el-divider v-if="index != institutionList.length - 1"></el-divider>
      </div>
    </div>
    <div class="associated-pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="institutionTotalSize"
        @current-change="changePage()"
        v-model:current-page="pageCurrent"
        hide-on-single-page
        :page-sizes="[1, 2, 3, 4, 5]"
        :page-size="5"
      />
    </div>
  </div>
</template>

<script setup>
import { Right } from "@element-plus/icons-vue";
import { defineEmits } from "vue";
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
  border-radius: 20px;
  box-shadow: 3px 3px 3px 3px #dedede;

  display: flex;
  flex-direction: column;
  align-items: center;
}

.assiciated-title {
  font-size: 18px;
  font-weight: 800;
  text-align: left;
  margin-top: 30px;
  margin-bottom: 30px;
  width: 90%;
}

.institution-list {
  width: 90%;
  height: 92%;
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
  height: 100px;
  margin-top: 5px;
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

.el-divider--horizontal {
  margin-top: 0;
}

.institution-card li {
  list-style: none;
  margin-right: 20px;
  display: inline-block;
  height: 100%;
  vertical-align: middle;
}

.institution-card .associated-name-li {
  width: calc(100% - 160px);
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
  /* white-space: nowrap; */
}

.institution-card .associated-name {
  font-size: 15px;
  font-weight: 800;
  text-align: left;
  display: flex;
  align-items: center;
  height: 80%;
  width: 100%;
  cursor: pointer;
  /* height: 20%;
    margin-top: 5; */
  /* display: block; */
}

.institution-card .associated-name:hover {
  color: #409eff;
  /* height: 20%;
    margin-top: 5; */
  /* display: block; */
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

.right-arrow-wrap:hover {
  color: #409eff;
}
</style>
