<template>
  <el-card class="card" style="box-shadow: 3px 3px 3px 3px #dedede;">
    <el-collapse :model-value="['1']">
      <el-collapse-item name="1">
        <template #title>
          <span class="ctitle">
            领域
          </span>
        </template>
        <el-scrollbar max-height="80vh">
          <div v-for="(item, index) in paperInfo.concepts" :key="index" class="href_text card-concepts-wrap"
            :style="{ backgroundColor: getColor(item.score) }" @click="gotoConcept(item)">
            {{ item.display_name }}
          </div>
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>
  </el-card>

  <el-card class="card  assiciated-wrap" style="margin-top:20px;box-shadow: 3px 3px 3px 3px #dedede;">
    <el-collapse :model-value="['2']">
      <el-collapse-item name="2">
        <template #title>
          <span class="ctitle">
            相关文献
          </span>
        </template>
        <el-scrollbar max-height="60vh">
          <div v-for="(item, index) in related" :key="index" v-html="item.display_name" style="margin-bottom:10px"
            class="href_text ppg" @click="gotoPaper(item)"></div>
        </el-scrollbar>
      </el-collapse-item>
    </el-collapse>
  </el-card>
</template>
<script setup>
import { useRouter } from 'vue-router';
import { Search } from "../../api/search";
const related = ref([])
const router = useRouter();
const props = defineProps({
  paperInfo: Object,
  paperId: String
})
function getColor(s) {
  if (s > 0.5) {
    return "#3985ee";
  } else if (s > 0.3) {
    return "#69a7ff";
  } else if (s > 0.1) {
    return "#aacdff";
  } else {
    return "#cfe3ff";
  }
}
function gotoPaper(concept) {
  if (!concept)
    return;
  let { href } = router.resolve({
    name: "PaperDetail",
    params: {paperid: concept.id.substring(21)},
  });
  window.open(href, "_blank");
}

function gotoConcept(concept) {
  if (!concept)
    return;
  let { href } = router.resolve({
    name: "ConceptDetail",
    params: {tokenid: concept.id.substring(21)},
  });
  window.open(href, "_blank");
}

onMounted(() => {
  Search.getSearchDataList(
    {
      entity_type: "works",
      params: {
        related_to: props.paperId
      }
    }
  ).then((res) => {
    related.value = res.data.list_of_data[0].results
  })
})
</script>
<style scoped>
.daadada{
  color: #69a7ff;
}
.ctitle {
  font-size: 18px;
  font-weight: 800;
  text-align: left;
  width: 90%;
  height: 40px;
  line-height: 40px;
  /* FIX by cloud-iris 这里将原来的 #8f8f89 替换为 #dedede */
  border-left: 10px #dedede solid;
  padding-left: 5px
}

.href_text {
  margin-top: 2px;
  color: rgb(117, 117, 117);
  background-color: transparent;
  transition: .2s;
  cursor: pointer;
}

.href_text:hover {
  border-color: #45a1fd;
  cursor: pointer;
}

.card-concepts-wrap {
  float: left;
  color: white;
  margin-right: 10px;
  margin-bottom: 5px;
  padding: 3px 5px;
  box-sizing: border-box;
  border: 2px solid;
  /* FIX by cloud-iris 这里加大圆角实现气泡效果 */
  border-radius: 18px;
  font-size: 14px;
}

.card {
  border-radius: 0px;
  box-shadow: 3px 3px 3px 3px #dedede;
}

.assiciated-wrap {
  position: sticky;
  top: 0px;
}

.ppg {
  border-left: 5px #dedede solid;
  padding: 3px;
  margin-bottom: 5px;
  box-shadow: 1px 1px 1px 1px rgb(202, 202, 202);
}

.el-button.is-disabled {
  background-color: white;
  border-color: red;
  transition: all 0.1s;
}

.el-button.is-disabled:focus,
.el-button.is-disabled:hover {
  background-color: white;
  border-color: red;
  filter: blur(1px);
}
</style>